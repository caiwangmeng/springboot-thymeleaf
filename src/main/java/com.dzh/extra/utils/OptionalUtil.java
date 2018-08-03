package com.dzh.extra.utils;

import java.util.Optional;
import java.util.function.Function;

public class OptionalUtil {
    
    public static <V,T> V getOrNull(T t, Function<? super T, V> keyMapper){
        Optional<T> opt = Optional.ofNullable(t); 
        V result = opt.map(keyMapper).orElse(null);
        return result;
    }
}
