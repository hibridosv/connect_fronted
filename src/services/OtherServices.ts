import { getSession } from 'next-auth/react';

export async function postFormData(endpoint: string, formData: FormData) {
  const session = await getSession();
  if (!session?.accessToken || !session?.url) return null;

  const response = await fetch(`${session.url}/api/v2/${endpoint}`, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: formData,
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${session.accessToken}`,
    },
  });

  const body = await response.json().catch(() => null);
  // fetch no falla con 4xx/5xx: se lanza con la forma de axios para que el catch lea error.response.data.message
  if (!response.ok) {
    throw Object.assign(new Error(body?.message ?? `Error ${response.status}`), {
      response: { status: response.status, data: body },
    });
  }
  return body;
}

export async function postForPrint(url = '', method = 'POST', data = {}) {
    // Esta peticion debe llevar toda la url por parametros
        try {
          await fetch(`${url}`, {
            method: method,
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(data),
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
          });
        } catch (error) {
          console.error(error)
        }
    }
  