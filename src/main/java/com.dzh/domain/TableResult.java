package com.dzh.domain;

import java.util.List;

/**
 *  Bootstrap 返回值同一结构
 * @param <T>
 */
public class TableResult<T> {

    /**
     * 构参部分
     */
    public TableResult(List<T> rows){
        this.rows = rows;
        this.total = rows.size();
    }

    public TableResult(){}

    public TableResult(List<T> rows, Integer total){
        this.rows = rows;
        this.total = total;
    }

    /**
     * 属性
     */
    private Integer total;

    private List<T> rows;

    /* setter & getter */
    public Integer getTotal() {
        return total;
    }

    public void setTotal(Integer total) {
        this.total = total;
    }

    public List<T> getRows() {
        return rows;
    }

    public void setRows(List<T> rows) {
        this.rows = rows;
    }

}
