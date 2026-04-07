import { parseJsonSafe } from './utils';

/** Même logique que le front React : message API, erreurs Zod, ou guide selon le statut HTTP (pour fetch). */

type ApiErrorBody = {
  message?: string;
  errors?: Array<{ path?: string; message?: string }>;
};

function formatValidationErrors(
  errors: NonNullable<ApiErrorBody['errors']>
): string | null {
  if (!errors.length) return null;
  const parts = errors
    .map((e) => {
      const raw = e.path ?? '';
      const field = raw.replace(/^(body|query|params)\./, '');
      const detail = e.message?.trim() || '';
      if (field && detail) return `${field} : ${detail}`;
      return detail || field || null;
    })
    .filter((x): x is string => Boolean(x));
  return parts.length ? parts.join(' · ') : null;
}

function normalizeForCompare(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\.+$/, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function isVagueServerMessage(msg: string): boolean {
  const n = normalizeForCompare(msg);
  if (!n) return true;

  const exactVague = new Set([
    normalizeForCompare("Erreur lors de l'enregistrement"),
    normalizeForCompare("Erreur lors de l'enregistrement."),
    normalizeForCompare('Erreur lors de la création'),
    normalizeForCompare('Erreur lors de la mise à jour'),
    normalizeForCompare('Erreur lors de la mise a jour'),
    normalizeForCompare('Erreur lors de la suppression'),
    normalizeForCompare('Erreur lors de la récupération'),
    normalizeForCompare('Erreur lors de la recuperation'),
    normalizeForCompare('Erreur'),
    normalizeForCompare('Non trouvé'),
  ]);

  if (exactVague.has(n)) return true;

  if (
    n.startsWith('erreur lors de la recuperation') ||
    n.startsWith('erreur lors de la récupération')
  ) {
    return n.length < 100;
  }

  if (
    /^erreur lors de l'enregistrement\b/i.test(msg.trim()) &&
    msg.trim().length < 80
  ) {
    return true;
  }

  return false;
}

function capitalize(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function guidanceForHttpStatus(status: number): string {
  switch (status) {
    case 400:
      return 'données refusées : vérifiez les champs du formulaire.';
    case 401:
      return 'session expirée ou identifiants invalides. Reconnectez-vous si besoin.';
    case 403:
      return "vous n'avez pas l'autorisation pour cette action.";
    case 404:
      return 'élément introuvable.';
    case 409:
      return "conflit : cet élément existe déjà ou est lié à d'autres données.";
    default:
      if (status >= 500) {
        return 'problème temporaire côté serveur. Réessayez dans un instant.';
      }
      return `réponse HTTP ${status}. Réessayez ou contactez le support.`;
  }
}

function parseApiBody(data: unknown): ApiErrorBody | null {
  if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
    return data as ApiErrorBody;
  }
  return null;
}

/**
 * À utiliser après fetch + parseJsonSafe sur le corps (succès ou erreur).
 */
export function getFetchApiErrorMessage(
  status: number,
  body: unknown,
  actionHint?: string
): string {
  const hint = actionHint?.trim();
  const data = parseApiBody(body);
  const fromErrors = data?.errors ? formatValidationErrors(data.errors) : null;
  const rawMsg =
    typeof data?.message === 'string' ? data.message.trim() : '';

  if (status === 400 && fromErrors) {
    return fromErrors;
  }

  if (rawMsg && rawMsg !== 'Validation échouée' && !isVagueServerMessage(rawMsg)) {
    return rawMsg;
  }
  if (fromErrors) return fromErrors;
  if (rawMsg && rawMsg !== 'Validation échouée' && !isVagueServerMessage(rawMsg)) {
    return rawMsg;
  }

  const guidance = capitalize(guidanceForHttpStatus(status));
  if (hint) {
    return `${hint} — ${guidance}`;
  }
  return guidance;
}

/**
 * Lit le corps JSON d’une réponse fetch une seule fois et produit un message d’erreur explicite si !res.ok.
 */
export async function readFetchResult<T = unknown>(
  res: Response,
  errorHint?: string
): Promise<{ ok: true; data: T } | { ok: false; message: string }> {
  const data = await parseJsonSafe<unknown>(res, {});
  if (!res.ok) {
    return {
      ok: false,
      message: getFetchApiErrorMessage(res.status, data, errorHint),
    };
  }
  return { ok: true, data: data as T };
}
