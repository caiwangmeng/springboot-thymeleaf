package com.dzh.extra.utils;

import java.util.Collection;
import java.util.Map;

/**
 *
 * 该类copy自spring AssertUtil,避免 util引用spring-core jar包.
 *
 * @version $Id: AssertUtil.java, v 0.1 2016年12月26日 下午1:45:40 niaoge Exp $
 */
public class AssertUtil {
    public static void throwException(String message){
        throw new IllegalArgumentException(message);
    }
    
    /**
     * Assert a boolean expression, throwing {@code IllegalArgumentException}
     * if the test result is {@code false}.
     * <pre class="code">Assert.isTrue(i &gt; 0, "The value must be greater than zero");</pre>
     * @param expression a boolean expression
     * @param message the exception message to use if the assertion fails
     * @throws IllegalArgumentException if expression is {@code false}
     */
    public static void mustTrue(boolean expression, String message) {
        if (!expression) {
            throw new IllegalArgumentException(message);
        }
    }

    /**
     * Assert a boolean expression, throwing {@code IllegalArgumentException}
     * if the test result is {@code false}.
     * <pre class="code">Assert.isTrue(i &gt; 0);</pre>
     * @param expression a boolean expression
     * @throws IllegalArgumentException if expression is {@code false}
     */
    public static void mustTrue(boolean expression) {
        mustTrue(expression, "[Assertion failed] - this expression must be true");
    }

    /**
     * Assert that an object is {@code null} .
     * <pre class="code">Assert.isNull(value, "The value must be null");</pre>
     * @param object the object to check
     * @param message the exception message to use if the assertion fails
     * @throws IllegalArgumentException if the object is not {@code null}
     */
    public static void mustNull(Object object, String message) {
        if (object != null) {
            throw new IllegalArgumentException(message);
        }
    }

    /**
     * Assert that an object is {@code null} .
     * <pre class="code">Assert.isNull(value);</pre>
     * @param object the object to check
     * @throws IllegalArgumentException if the object is not {@code null}
     */
    public static void mustNull(Object object) {
        mustNull(object, "[Assertion failed] - the object argument must be null");
    }

    /**
     * Assert that an object is not {@code null} .
     * <pre class="code">Assert.notNull(clazz, "The class must not be null");</pre>
     * @param object the object to check
     * @param message the exception message to use if the assertion fails
     * @throws IllegalArgumentException if the object is {@code null}
     */
    public static void mustNotNull(Object object, String message) {
        if (object == null) {
            throw new IllegalArgumentException(message);
        }
    }

    /**
     * Assert that an object is not {@code null} .
     * <pre class="code">Assert.notNull(clazz);</pre>
     * @param object the object to check
     * @throws IllegalArgumentException if the object is {@code null}
     */
    public static void mustNotNull(Object object) {
        mustNotNull(object, "[Assertion failed] - this argument is required; it must not be null");
    }

    /**
     * Assert that the given ConstString is not empty; that is,
     * it must not be {@code null} and not the empty ConstString.
     * <pre class="code">Assert.hasLength(name, "Name must not be empty");</pre>
     * @param text the ConstString to check
     * @param message the exception message to use if the assertion fails
     * @throws IllegalArgumentException if the text is empty
     */
    public static void mustNotBlank(String text, String message) {
        if (StringUtil.isBlank(text)) {
            throw new IllegalArgumentException(message);
        }
    }

    /**
     * Assert that the given ConstString is not empty; that is,
     * it must not be {@code null} and not the empty ConstString.
     * <pre class="code">Assert.hasLength(name);</pre>
     * @param text the ConstString to check
     * @throws IllegalArgumentException if the text is empty
     */
    public static void mustNotBlank(String text) {
        mustNotBlank(text, "[Assertion failed] - this ConstString argument must have length; it must not be null or empty");
    }
    
    public static void mustNotEmpty(String dest, String message) {
        if (StringUtil.isEmpty(dest)) {
            throw new IllegalArgumentException(message);
        }
    }

    /**
     * Assert that an array has elements; that is, it must not be
     * {@code null} and must have at least one element.
     * <pre class="code">Assert.notEmpty(array);</pre>
     * @param array the array to check
     * @throws IllegalArgumentException if the object array is {@code null} or has no elements
     */
    public static void mustNotEmpty(String dest) {
        mustNotEmpty(dest, "[Assertion failed] - this ConstString argument must have length; it must not be null or empty");
    }  

    /**
     * Assert that an array has elements; that is, it must not be
     * {@code null} and must have at least one element.
     * <pre class="code">Assert.notEmpty(array, "The array must have elements");</pre>
     * @param array the array to check
     * @param message the exception message to use if the assertion fails
     * @throws IllegalArgumentException if the object array is {@code null} or has no elements
     */
    public static void mustNotEmpty(Object[] array, String message) {
        if (CollectionUtil.isEmpty(array)) {
            throw new IllegalArgumentException(message);
        }
    }

    /**
     * Assert that an array has elements; that is, it must not be
     * {@code null} and must have at least one element.
     * <pre class="code">Assert.notEmpty(array);</pre>
     * @param array the array to check
     * @throws IllegalArgumentException if the object array is {@code null} or has no elements
     */
    public static void mustNotEmpty(Object[] array) {
        mustNotEmpty(array, "[Assertion failed] - this array must not be empty: it must contain at least 1 element");
    }

    /**
     * Assert that a collection has elements; that is, it must not be
     * {@code null} and must have at least one element.
     * <pre class="code">Assert.notEmpty(collection, "Collection must have elements");</pre>
     * @param collection the collection to check
     * @param message the exception message to use if the assertion fails
     * @throws IllegalArgumentException if the collection is {@code null} or has no elements
     */
    public static void mustNotEmpty(Collection<?> collection, String message) {
        if (CollectionUtil.isEmpty(collection)) {
            throw new IllegalArgumentException(message);
        }
    }

    /**
     * Assert that a collection has elements; that is, it must not be
     * {@code null} and must have at least one element.
     * <pre class="code">Assert.notEmpty(collection, "Collection must have elements");</pre>
     * @param collection the collection to check
     * @throws IllegalArgumentException if the collection is {@code null} or has no elements
     */
    public static void mustNotEmpty(Collection<?> collection) {
        mustNotEmpty(collection, "[Assertion failed] - this collection must not be empty: it must contain at least 1 element");
    }

    /**
     * Assert that a Map has entries; that is, it must not be {@code null}
     * and must have at least one entry.
     * <pre class="code">Assert.notEmpty(map, "Map must have entries");</pre>
     * @param map the map to check
     * @param message the exception message to use if the assertion fails
     * @throws IllegalArgumentException if the map is {@code null} or has no entries
     */
    public static void mustNotEmpty(Map<?, ?> map, String message) {
        if (CollectionUtil.isEmpty(map)) {
            throw new IllegalArgumentException(message);
        }
    }

    /**
     * Assert that a Map has entries; that is, it must not be {@code null}
     * and must have at least one entry.
     * <pre class="code">Assert.notEmpty(map);</pre>
     * @param map the map to check
     * @throws IllegalArgumentException if the map is {@code null} or has no entries
     */
    public static void mustNotEmpty(Map<?, ?> map) {
        mustNotEmpty(map, "[Assertion failed] - this map must not be empty; it must contain at least one entry");
    }

    /**
     * Assert that the provided object is an instance of the provided class.
     * <pre class="code">Assert.instanceOf(Foo.class, foo);</pre>
     * @param clazz the required class
     * @param obj the object to check
     * @throws IllegalArgumentException if the object is not an instance of clazz
     * @see Class#isInstance
     */
    public static void mustInstanceOf(Class<?> clazz, Object obj) {
        mustInstanceOf(clazz, obj, "");
    }

    /**
     * Assert that the provided object is an instance of the provided class.
     * <pre class="code">Assert.instanceOf(Foo.class, foo);</pre>
     * @param type the type to check against
     * @param obj the object to check
     * @param message a message which will be prepended to the message produced by
     * the function itself, and which may be used to provide context. It should
     * normally end in ":" or "." so that the generated message looks OK when
     * appended to it.
     * @throws IllegalArgumentException if the object is not an instance of clazz
     * @see Class#isInstance
     */
    public static void mustInstanceOf(Class<?> type, Object obj, String message) {
        mustNotNull(type, "Type to check against must not be null");
        if (!type.isInstance(obj)) {
            throw new IllegalArgumentException((StringUtil.isNotBlank(message) ? message + " " : "") + "Object of class ["
                                               + (obj != null ? obj.getClass().getName() : "null") + "] must be an instance of " + type);
        }
    }

    /**
     * Assert that {@code superType.isAssignableFrom(subType)} is {@code true}.
     * <pre class="code">Assert.isAssignable(Number.class, myClass);</pre>
     * @param superType the super type to check
     * @param subType the sub type to check
     * @throws IllegalArgumentException if the classes are not assignable
     */
    public static void mustAssignable(Class<?> superType, Class<?> subType) {
        mustAssignable(superType, subType, "");
    }

    /**
     * Assert that {@code superType.isAssignableFrom(subType)} is {@code true}.
     * <pre class="code">Assert.isAssignable(Number.class, myClass);</pre>
     * @param superType the super type to check against
     * @param subType the sub type to check
     * @param message a message which will be prepended to the message produced by
     * the function itself, and which may be used to provide context. It should
     * normally end in ":" or "." so that the generated message looks OK when
     * appended to it.
     * @throws IllegalArgumentException if the classes are not assignable
     */
    public static void mustAssignable(Class<?> superType, Class<?> subType, String message) {
        mustNotNull(superType, "Type to check against must not be null");
        if (!superType.isAssignableFrom(subType)) {
            throw new IllegalArgumentException(
                (StringUtil.isNotBlank(message) ? message + " " : "") + subType + " is not assignable to " + superType);
        }
    }

}
