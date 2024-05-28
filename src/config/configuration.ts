export type ENVConfiguration = ReturnType<typeof configuration>;

export const configuration = () => {
  const config = {
    port: Number(process.env.PORT) || 3000,
    db: {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      name: process.env.DB_NAME,
    },
    hash: {
      time: Number(process.env.HASH_TIME) || 10,
    },
    jwt: {
      secert: process.env.JWT_SECRET,
    },
  };

  return config;
};

export type Leaves<T> = T extends object
  ? {
      [K in keyof T]: `${Exclude<K, symbol>}${Leaves<T[K]> extends never
        ? ''
        : `.${Leaves<T[K]>}`}`;
    }[keyof T]
  : never;

export type LeafTypes<T, S extends string> = S extends `${infer T1}.${infer T2}`
  ? T1 extends keyof T
    ? LeafTypes<T[T1], T2>
    : never
  : S extends keyof T
  ? T[S]
  : never;
