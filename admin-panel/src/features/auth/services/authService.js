export async function mockLogin(credentials) {
  await new Promise((resolve) => setTimeout(resolve, 600));

  if (!credentials.email || !credentials.password) {
    throw new Error('Email and password are required.');
  }

  return {
    token: `fake-jwt-${crypto.randomUUID()}`,
    user: {
      id: 'usr_001',
      name: 'Admin User',
      email: credentials.email,
      role: 'ADMIN'
    }
  };
}
