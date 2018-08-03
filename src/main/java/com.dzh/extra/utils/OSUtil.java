package com.dzh.extra.utils;

/***
 * 简单操作系统的工具类
 * 
 * @author XiaZhengsheng
 * @version $Id: OSUtil.java, v 0.1 2016年12月26日 下午2:28:14 XiaZhengsheng Exp $
 */
public class OSUtil {
    public static  final String filePrefix = "file:";
    private static  final String windows_lower = "windows";
    private static  final String os_name = "os.name";
    
    /**
     * The Class OsPath.
     *
     * @version $Id: CompatibilityPathUtil.java, v 0.1 2016-3-16 14:17:36 xiazhengsheng Exp $
     */
    public static class OsPath {
        
        /**
         * *  The is windows.
         */
        boolean isWindows      = false;
        
        /**
         * *  The disk path.
         */
        String  diskPath       = null;
        
        /**
         * *  The web context path.
         */
        String  webContextPath = null;
    }

    public static OsPath getOsPath() {
        OsPath result = new OsPath();

        
        String osName = System.getProperties().getProperty(os_name);
        if (osName!=null && !osName.isEmpty()) {
            osName = osName.toLowerCase();
            result.isWindows = osName.indexOf(windows_lower) > -1;
        }

        if (result.isWindows) {
            result.webContextPath = Thread.currentThread().getContextClassLoader().getResource("")
                .getPath();
            int idx = result.webContextPath.indexOf(':');
            if (idx > -1) {
                result.diskPath = filePrefix + result.webContextPath.substring(0, idx + 1);
                result.webContextPath = filePrefix + result.webContextPath;
            }
        }

        return result;
    }
    
    public static String getRealUriPathByOs(String fileName ,OsPath osPath){
        if (osPath.isWindows && osPath.diskPath!=null && !osPath.diskPath.isEmpty() && fileName.startsWith(filePrefix)
                && !fileName.startsWith(osPath.webContextPath) && !fileName.startsWith(osPath.diskPath)) {
               //file:
                fileName = fileName.substring(filePrefix.length());
                fileName = new StringBuffer(fileName.length() + osPath.diskPath.length())
                    .append(osPath.diskPath).append(fileName).toString();
                
        }
        return fileName;
    }
    
    
    public static String getRealUriPathByOs(String fileName ){
        OsPath osPath =getOsPath();
        return getRealUriPathByOs(fileName, osPath);
    }
}
