import { Resend } from 'resend';

// Use a mock in test environments to prevent sending actual emails during CI/CD or local tests
const isTest = process.env.NODE_ENV === 'test' || process.env.RESEND_API_KEY === 're_test_123';

export const resend = isTest 
  ? ({
      emails: {
        send: async (payload: any) => {
          console.log(`[TEST MOCK] Intercepted email to ${payload.to} with subject "${payload.subject}"`);
          return { data: { id: `test_mock_id_${Date.now()}` }, error: null };
        }
      }
    } as any as Resend)
  : new Resend(process.env.RESEND_API_KEY);

export const getFromEmail = () => {
  return process.env.RESEND_FROM_EMAIL || 'orders@yourdomain.com';
};
