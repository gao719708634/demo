//页面缓存mixins
export let cacheMixins = {
  data () {
    return {
      defaultPageSize: 10,
      cache: {},
      query: {}, //缓存条件或者查询条件
      useCache: true, //是否采用缓存
      currentPage: 1,
      cacheTimeout: 60000
    };
  },
  methods: {
    _getCacheKey (key) {
      //调用全局mixins 方法(jsonToString)
      return key ? this._jsonToString(key) : this._jsonToString(this.query);
    },
    _saveCache (data, key) {
      if (this.useCache === true) {
        this.cache[this._getCacheKey(key)] = {
          time: +new Date,
          data: data
        };
        return this;
      } else {
        return this;
      }
    },
    _getCache (key) {
      const _data = key ? this.cache[this._jsonToString(key)] : this.cache[this._getCacheKey()];
      if (_data && (+new Date - _data.time) < this.cacheTimeout) {
        return _data.data;
      }
      return '';
    },
    _resetCache (key) {
      delete this.cache[this._getCacheKey(key)];
      return this;
    },
    _clearCache () {
      this.cache = [];
      return this;
    },
    _setPageObject () {
      try {
        this.pagination.current = this.page;
        this.pagination.pageSize = Number(this.$route.query.pageSize||this.defaultPageSize);
      } catch (e) {
        console.log(e);
      }
    }
  },
  beforeDestroy () {
    if (this.useCache) {
      this.cache = null;
    }
  }
};