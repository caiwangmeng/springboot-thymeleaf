/**
 * YaoK.com Inc.
 * Copyright (c) 2016-2016 All Rights Reserved.
 */
package com.dzh.extra.utils;

import java.security.KeyPair;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;

/**
 * The Class RsaKeypair.
 *
 * @author Xia Zhengsheng
 * @version $Id: RsaKeypair.java, v 0.1 2016-8-28 23:46:50 Xia zhengsheng Exp $
 */
public class RSAKeyPair {
    private KeyPair keyPair;

    public RSAKeyPair(KeyPair keyPair) {
        this.keyPair = keyPair;
    }

    /**
     * 公钥.
     *
     * @return the public key
     */
    public PublicKey getPublicKey() {
        return (RSAPublicKey) keyPair.getPublic();
    }

    /**
     *  私钥.
     *
     * @return the private key
     */
    public PrivateKey getPrivateKey() {
        return (RSAPrivateKey) keyPair.getPrivate();
    }

    /**
     * 得到公钥字符串
     */
    public String getPublicKeyString() {
        return Base64Util.encodeKey(getPublicKey());

    }

    /**
     * 得到私钥字符串
     */
    public String getPrivateKeyString() {
        return Base64Util.encodeKey(getPrivateKey());
    }
}
