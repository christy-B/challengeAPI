export type StructuredErrors =
  // SQL
  'sql/failed' |
  'sql/not-found' |

  // Crud
  'validation/failed' |

  // Authorization
  'auth/missing-email' |
  'auth/unknown-email' |
  'auth/missing-magic-link-token' |
  'auth/invalid-magic-link-token' |
  'auth/missing-header' |
  'auth/access-token-expired' |
  'auth/invalid-access-token' |
  'auth/insufficient-scopes' |
  'auth/missing-renew-token' |
  'auth/invalid-renew-token' |


  // Default
  'internal/unknown'
  ;
