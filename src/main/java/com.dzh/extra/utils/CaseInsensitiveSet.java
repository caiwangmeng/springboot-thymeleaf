package com.dzh.extra.utils;

import java.io.Serializable;
import java.util.Collection;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

/**
 * The Class CaseInsensitiveSet.
 * 不区分大小写的HashSet
 */
public class CaseInsensitiveSet implements Set<String>,Serializable {
    
    /**
     * *  The Constant serialVersionUID.
     */
    private static final long serialVersionUID = 1L;
    
    /**
     * *  The lower map.
     */
    private Map<String, String> lowerMap;
    
    /**
     * Instantiates a new case insensitive set.
     */
    public CaseInsensitiveSet() {
        super();
        lowerMap=new ConcurrentHashMap<String, String>();
    }
    
    
    /**
     * Instantiates a new case insensitive set.
     *
     * @param capcity the capcity
     */
    public CaseInsensitiveSet(Integer capcity) {
        super();
        lowerMap=new ConcurrentHashMap<String, String>(capcity);
    }
    
    /**
     * Instantiates a new case insensitive set.
     *
     * @param c the c
     */
    public CaseInsensitiveSet(Collection<? extends String> c) {
        super();
        lowerMap=new ConcurrentHashMap<String, String>(c.size());
        this.addAll(c);
    }

    /** 
     * @see Set#size()
     */
    @Override
    public int size() {
        return lowerMap.size();
    }

    @Override
    public boolean isEmpty() {
        return lowerMap.isEmpty();
    }

    /** 
     * @see Set#contains(Object)
     */
    @Override
    public boolean contains(Object o) {
        return lowerMap.containsKey(((String)o).toLowerCase());
    }

    /** 
     * @see Set#iterator()
     */
    @Override
    public Iterator<String> iterator() {
        return lowerMap.values().iterator();
    }

    /** 
     * @see Set#toArray()
     */
    @Override
    public Object[] toArray() {
        return lowerMap.values().toArray();
    }

    /** 
     * @see Set#toArray(Object[])
     */
    @Override
    public <T> T[] toArray(T[] a) {
        return lowerMap.values().toArray(a);
    }

    /** 
     * @see Set#add(Object)
     */
    @Override
    public boolean add(String e) {
        lowerMap.put(e.toLowerCase(), e);
        return true;
    }

    /** 
     * @see Set#remove(Object)
     */
    @Override
    public boolean remove(Object o) {
        lowerMap.remove(((String)o).toLowerCase());
        return true;
    }

    /** 
     * @see Set#containsAll(Collection)
     */
    @Override
    public boolean containsAll(Collection<?> c) {
        for (Object o : c) {
          if (!lowerMap.containsKey(((String)o).toLowerCase())){
              return false;
          }
        }
        return true;
    }

    /** 
     * @see Set#addAll(Collection)
     */
    @Override
    public boolean addAll(Collection<? extends String> c) {
        for (String s : c) {
            lowerMap.put(s.toLowerCase(), s);
        }
        return true;
    }

    /** 
     * @see Set#clear()
     */
    @Override
    public void clear() {
        lowerMap.clear();
    }


    /** 
     * @see Set#retainAll(Collection)
     */
    @Override
    public boolean retainAll(Collection<?> c) {
        clear();
        for (Object o : c) {
            lowerMap.put(((String)o).toLowerCase(), (String)o);
        }
        return true;
    }

    /** 
     * @see Set#removeAll(Collection)
     */
    @Override
    public boolean removeAll(Collection<?> c) {
        for (Object o : c) {
            lowerMap.remove(((String)o).toLowerCase());
        }
        return true;
    }

    
}