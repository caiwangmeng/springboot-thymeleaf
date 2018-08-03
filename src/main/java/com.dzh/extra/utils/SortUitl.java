package com.dzh.extra.utils;

import java.util.Comparator;
import java.util.List;
import java.util.function.Function;

public class SortUitl {
    
    final static org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(SortUitl.class);

    public static enum CompareResult {
        /***等于 ，0*/
        EQUAL(0), 
        /***大于 ,1*/
        GREAT(1), 
        /***小于 -1*/
        LOW(-1), 
        /***都为空 0*/
        ALL_NULL(0);
        int value;

        CompareResult(int value) {
            this.value = value;
        }

        public int getValue() {
            return value;
        }
    }

    public static CompareResult beanPointerCompare(Object o1, Object o2) {
        if (o1 != null && o2 == null) {
            return CompareResult.GREAT;
        }

        if (o1 == null && o2 != null) {
            return CompareResult.LOW;
        }

        if (o1 == null && o2 == null) {
            return CompareResult.ALL_NULL;
        }
        
        return CompareResult.EQUAL;
    }

    @SuppressWarnings({ "rawtypes", "unchecked" })
    public static <T> CompareResult valueCompare(T o1, T o2, Function<? super T, ? extends Comparable<?>> getMethod) {
        Comparable v1 = getMethod.apply(o1);
        Comparable v2 = getMethod.apply(o2);
        CompareResult result = beanPointerCompare(v1, v2);
        if (result == CompareResult.EQUAL) {
            int compareValue= v1.compareTo(v2);
            if (compareValue >= 1) {
                return CompareResult.GREAT;
            }
            if (compareValue <= -1) {
                return CompareResult.LOW;
            }

            return CompareResult.EQUAL;
        }
        return result;
    }

    static class CompoundSort<T> implements Comparator<T> {
        
        private Function<? super T, ? extends Comparable<?>>[] keyMappers = null;

        @SuppressWarnings("unchecked")
        public  CompoundSort(Function<? super T, ? extends Comparable<?>>[] getMethods) {
            if (CollectionUtil.isNotEmpty(getMethods)){
                this.keyMappers = getMethods;
            } else {
                this.keyMappers =(Function<? super T, ? extends Comparable<?>>[]) new Object[0];
            }
        }

        @Override
        public int compare(T o1, T o2) {
            CompareResult valueCompare=beanPointerCompare(o1,o2);
            if (valueCompare==CompareResult.EQUAL){
                for (int i = 0; i < keyMappers.length; i++) {
                    Function<? super T, ? extends Comparable<?>> function = keyMappers[i];
                    valueCompare = valueCompare(o1, o2, function);
                    if (valueCompare!=CompareResult.EQUAL){
                        return valueCompare.getValue();
                    }
                }
            }
            return valueCompare.getValue();
        }

    }

    @SafeVarargs
    public static <T> void sort(List<T> items, Function<? super T, ? extends Comparable<?>>... getMethods) {
        items.sort(new CompoundSort<T>(getMethods));
    }

}
