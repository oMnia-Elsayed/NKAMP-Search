import {  Injectable } from '@angular/core';

declare const require;
const CryptoJS = require('crypto-js');
// the key should be of 16 characters because we are using 128 bit encryption
const plainKey = 'P@ssw0rd#abc$^&*';
const plainKeyBytes = CryptoJS.enc.Utf8.parse(plainKey);

@Injectable({
  providedIn: 'root',
})
export class EncryptionService {
  constructor() {}
  public encrypt(textToEncrypt: string): string {

    const textToEncryptBytes = CryptoJS.enc.Utf8.parse(textToEncrypt);
    // the encrypt method takes a UTF8 array of bytes
    // the key should be UTF8 array of bytes
    const ciphertextBytes = CryptoJS.AES.encrypt(
      textToEncryptBytes,
      plainKeyBytes,
      {
        keySize: 128 / 8,
        iv: plainKeyBytes,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }
    );
    // the ciphertextBytes.ciphertext is a string encoded in Base64 therefore we are converting from Base64 to UTF8 string
    return ciphertextBytes.ciphertext.toString(CryptoJS.enc.Base64);
  }
  public decrypt(txtCipher: string): string {
    // the decrypt method takes a UTF8 string cipher
    // the key should be UTF8 array of bytes
    const plainTextBytes = CryptoJS.AES.decrypt(
      txtCipher,
      plainKeyBytes,
      {
        keySize: 128 / 8,
        iv: plainKeyBytes,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }
    );
    // the plainTextBytes is a UTF8 array of bytes
    return plainTextBytes.toString(CryptoJS.enc.Utf8);
  }
}
