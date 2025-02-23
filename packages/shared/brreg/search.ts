import type { Organization } from '@shared/brreg/types';
import { BRREG_ENHETER_URL } from '@shared/brreg/url';

interface OrganizationSearch {
  page: {
    number: number;
    size: number;
    totalPages: number;
    totalElements: number;
  };
  _embedded: {
    enheter: Organization[];
  };
}

const MAX_HITS = 5;

export const searchOrg = async (name: string): Promise<Organization[]> => {
  if (name.length === 0) {
    return [];
  }

  try {
    const res = await fetch(`${BRREG_ENHETER_URL}?size=${MAX_HITS}&navn=${encodeURIComponent(name)}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) {
      return [];
    }

    const data = (await res.json()) as OrganizationSearch;

    return data._embedded.enheter;
  } catch {
    return [];
  }
};
