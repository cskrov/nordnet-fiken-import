import type { Organization } from '@shared/brreg/types';
import { BRREG_ENHETER_URL } from '@shared/brreg/url';

const CACHE = new Map<string, Organization>();

export const getOrg = async (id: string): Promise<Organization | null> => {
  if (id.length !== 9) {
    return null;
  }

  const cached = CACHE.get(id);

  if (cached !== undefined) {
    return cached;
  }

  try {
    const res = await fetch(`${BRREG_ENHETER_URL}/${id}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) {
      return null;
    }

    const data = (await res.json()) as Organization;
    CACHE.set(id, data);

    return data;
  } catch {
    return null;
  }
};
