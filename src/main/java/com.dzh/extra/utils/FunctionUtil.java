package com.dzh.extra.utils;

import java.util.List;
import java.util.Map;
import java.util.function.BiConsumer;
import java.util.function.Function;

public class FunctionUtil {

    public static <D, S, V> D getAndSet(S source, D dest,Function<? super S, V> sourceMapper, BiConsumer<D, V> destConsumer) {
        V value = sourceMapper.apply(source);
        destConsumer.accept(dest, value);
        return dest;
    }

    public static <K, D, S , V> void eachGetAndSet(Map<K, S> sourceMap, List<D> dests, 
                                                                  Function<? super D, K> destKeyMapper,
                                                                  BiConsumer<D, V> destConsumer,Function<? super S, V> sourceMapper) {
        for (D dest : dests) {
            K key = destKeyMapper.apply(dest);
            if (key!=null){
                S source = sourceMap.get(key);
                if (source!=null){
                    V sourceValue = sourceMapper.apply(source);
                    destConsumer.accept(dest, sourceValue);
                }
            }
        }
    }
    
    public static <K, D, S , V extends Object> void eachGetAndSet(Map<K, S> sourceMap, List<D> dests, 
        Function<? super D, K> destKeyMapper,List<BiConsumer<D, V>> destConsumers,List<Function<? super S, V>> sourceMappers) {
        for (D dest : dests) {
            K key = destKeyMapper.apply(dest);
            if (key!=null){
                S source = sourceMap.get(key);
                if (source!=null){
                    for (int i=0 ;i<sourceMappers.size();i++)  {
                        Function<? super S, V> sourceMapper =sourceMappers.get(i);
                        BiConsumer<D, V> destConsumer=destConsumers.get(i);
                        V sourceValue = sourceMapper.apply(source);
                        destConsumer.accept(dest, sourceValue);
                    }
                }
            }
        }
    }

}
