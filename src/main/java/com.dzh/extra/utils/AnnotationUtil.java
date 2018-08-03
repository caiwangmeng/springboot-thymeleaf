package com.dzh.extra.utils;

import java.lang.annotation.Annotation;
import java.lang.reflect.AnnotatedElement;
import java.lang.reflect.Member;
import java.lang.reflect.Method;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * The Class AnnotationUtil.
 *  该类用来代替spring的 AnnotationUtils ,相比于 AnnotationUtils,该类可以获得继承方法上的annotation
 *  
 * @author Xia Zhengsheng
 * @version $Id: AnnotationUtil.java, v 0.1 2016-12-26 13:39:15 Xia zhengsheng Exp $
 */
public class AnnotationUtil {
  
    /**
     * The Class AnnotationWrapper. 该类用来生成annotation的缓存，用来快速获得查询结果
     *
     * @author Xia Zhengsheng
     * @version $Id: AnnotationUtil.java, v 0.1 2016-12-26 13:39:15 Xia zhengsheng Exp $
     */
    static class AnnotationWrapper {
        private Annotation annotation = null;

        public AnnotationWrapper(Annotation annotation) {
            this.annotation = annotation;
        }

        public Annotation getAnnotation() {
            return annotation;
        }
    }

    private static Map<AnnotatedElement, Map<Class<?> ,AnnotationWrapper>> annotatedElementAnnosCache = new ConcurrentHashMap<AnnotatedElement, Map<Class<?>,AnnotationWrapper>>();
    
    /**
     * 该方法不同于spring,它可以获得继承的标注.
     *
     * @param <A> the generic type
     * @param annotatedElement the annotated element
     * @param annotationType the annotation type
     * @return the annotation
     */
    @SuppressWarnings("unchecked")
    public static <A extends Annotation> A getAnnotation(AnnotatedElement annotatedElement, Class<A> annotationType) {
        Map<Class<?>, AnnotationWrapper> wrappersMap = annotatedElementAnnosCache.get(annotatedElement);
        if (wrappersMap != null) {
            AnnotationWrapper annotationWrapper = wrappersMap.get(annotationType);
            if (annotationWrapper!=null){
                return (A) annotationWrapper.getAnnotation();
            }
        }
        
        if (wrappersMap==null){
            wrappersMap =new ConcurrentHashMap<Class<?>, AnnotationWrapper>();
            annotatedElementAnnosCache.put(annotatedElement, wrappersMap);
        }
        
        A internalAnnoation = internalGetAnnoation(annotatedElement, annotationType);
        AnnotationWrapper wrapper = new AnnotationWrapper(internalAnnoation);
        wrappersMap.put(annotationType, wrapper);
        return internalAnnoation;
    }

    /**
     * Internal get annoation.
     *
     * @param <A> the generic type
     * @param annotatedElement the annotated element
     * @param annotationType the annotation type
     * @return the a
     */
    private static <A extends Annotation> A internalGetAnnoation(AnnotatedElement annotatedElement, Class<A> annotationType) {
        A annotation = annotatedElement.getAnnotation(annotationType);
        if (annotation != null) {
            return annotation;
        }

        if (annotatedElement instanceof Method) {
            Method method = (Method) annotatedElement;
            Class<?> superclass = method.getDeclaringClass().getSuperclass();
            if (superclass == null || superclass.isAssignableFrom(Object.class)) {
                return null;
            }
            
            Method[] methods = superclass.getMethods();
            String methodName = method.getName();
            Class<?> returnType = null;
            Class<?>[] parameterTypes = null;

            for (Method mtd : methods) {
                if (!methodName.equals(mtd.getName())) {
                    continue;
                }

                if (returnType == null) {
                    returnType = method.getReturnType();
                }

                if (!returnType.equals(mtd.getReturnType())) {
                    continue;
                }

                if (parameterTypes == null) {
                    parameterTypes = method.getParameterTypes();
                }

                Class<?>[] subParameterTypes = mtd.getParameterTypes();

                if (CollectionUtil.isEmpty(parameterTypes)) {
                    if (CollectionUtil.isNotEmpty(subParameterTypes)) {
                        continue;
                    }
                    return internalGetAnnoation(mtd, annotationType);
                }

                if (CollectionUtil.isEmpty(subParameterTypes)) {
                    continue;
                }

                if (parameterTypes.length != subParameterTypes.length) {
                    continue;
                }

                boolean isSame = true;
                for (int i = 0; i < parameterTypes.length; i++) {
                    if (!parameterTypes[i].equals(subParameterTypes[i])) {
                        isSame = false;
                        break;
                    }
                }

                if (!isSame) {
                    continue;
                }

                return internalGetAnnoation(mtd, annotationType);
            }
        }
        return annotation;
    }

    /**
     * Gets the annotation until supper.
     *
     * @param <A> the generic type
     * @param annotatedElement the annotated element
     * @param annotationType the annotation type
     * @return the annotation until supper
     */
    public static <A extends Annotation> A getAnnotationUntilSupper(AnnotatedElement annotatedElement, Class<A> annotationType) {
        A annotation = annotatedElement.getAnnotation(annotationType);
        if (annotation == null) {
            if (annotatedElement instanceof Class) {
                Class<?> clz = (Class<?>) annotatedElement;
                if (clz.getSuperclass() != null) {
                    return getAnnotationUntilSupper(clz.getSuperclass(), annotationType);
                }
            }
        }
        return annotation;
    }

    /**
     * Gets the parent annotation.
     *
     * @param <A> the generic type
     * @param annotatedElement the annotated element
     * @param annotationType the annotation type
     * @return the parent annotation
     */
    public static <A extends Annotation> A getParentAnnotation(AnnotatedElement annotatedElement, Class<A> annotationType) {
        if (annotatedElement instanceof Member) {
            Member member = (Member) annotatedElement;
            Class<?> declaringClass = member.getDeclaringClass();
            return getAnnotation(declaringClass, annotationType);
        }
        return null;
    }

    /**
     * Gets the annotation include parent.
     *
     * @param <A> the generic type
     * @param annotatedElement the annotated element
     * @param annotationType the annotation type
     * @return the annotation include parent
     */
    public static <A extends Annotation> A getAnnotationIncludeParent(AnnotatedElement annotatedElement, Class<A> annotationType) {
        A annotation = annotatedElement.getAnnotation(annotationType);
        if (annotation == null) {
            annotation = getParentAnnotation(annotatedElement, annotationType);
        }
        return annotation;
    }

}
