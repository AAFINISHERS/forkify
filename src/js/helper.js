import { async } from 'regenerator-runtime';
import { API_URL } from './config';
import { TIMEOUT_SECS } from './config';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};
/*
export const getJSON = async function (id) {
 
};
export const sendJSON = async function (url, uploadingData) {
  try {
    const fetchPro = 
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SECS)]);
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.status} ${res.status}`);
    return data;
  } catch (err) {
    throw err;
  }
};*/
export const AJAX = async function (url, uploadingData = undefined) {
  try {
    const fetchPro = uploadingData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadingData),
        })
      : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SECS)]);
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.status} ${res.status}`);
    return data;
  } catch (err) {
    throw err;
  }
};
