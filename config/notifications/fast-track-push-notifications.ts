import axios from "axios";

async function linkUserDevice(token: string, userId: string) {
  const data = {
    user_id: `${userId}`,
    origin: 'lendasbet.com',
    tokens: [
      {
        token: token,
        channel: 'web',
        provider: 'firebase',
      },
      {
        token: token,
        channel: 'ios',
        provider: 'firebase',
      },
      {
        token: token,
        channel: 'android',
        provider: 'firebase',
      },
    ],
    timestamp: '2019-09-12T10:00:00Z',
  };

    return await axios.post(
      'https://lendas.ft-crm.com/integration-api/api/v1/integration/user/device/link',
      data,
      {
        headers: {
          'x-api-key': 'UZx0WXUx9527rh3Sk4l22MCF4FXHzCIR',
          'Content-Type': 'application/json',
        },
      }
    );
}

async function unlinkUserDevice(token: string, userId: string) {
  const data = {
    user_id: `${userId}`,
    origin: 'lendasbet.com',
    tokens: [
      {
        token: token,
        channel: 'web',
        provider: 'firebase',
      },
      {
        token: token,
        channel: 'ios',
        provider: 'firebase',
      },
      {
        token: token,
        channel: 'android',
        provider: 'firebase',
      },
    ],
    timestamp: '2019-09-12T10:00:00Z',
  };

    return await axios.post(
      'https://lendas.ft-crm.com/integration-api/api/v1/integration/user/device/unlink',
      data,
      {
        headers: {
          'x-api-key': 'UZx0WXUx9527rh3Sk4l22MCF4FXHzCIR',
          'Content-Type': 'application/json',
        },
      }
    );
}

export { linkUserDevice, unlinkUserDevice };
