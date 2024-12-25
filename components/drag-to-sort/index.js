Component({
    relations: {
        '../drag-item/index': {
          type: 'child', // 关联的目标节点应为子节点
          linked: function(target) {
            this.child = this.child || []
            this.child.push(target)
          }
        }
    },
    properties: {
        dragY: {
            type: Boolean,
            value: false
        },
        dragX: {
            type: Boolean,
            value: false
        },
        length: {
            type: Number,
            value: 0
        }
    },
    data: {
        allLoaded: false
    },
    methods: {
        getScrollerRect() {
            const _query = this.createSelectorQuery()
            const query = wx.createSelectorQuery()
            _query.select('.drag-and-drop-list').boundingClientRect().exec(res => {
                console.log('_query_res', res)
            })
            query.select('#scroller').fields({
                size: true,
                scrollOffset: true,
                properties: ['scrollX', 'scrollY'],
                context: true,
              }).exec(res => {
                console.log('query_res', res)
            })
        },
        noticeChildInited(index) { // 如果index不为undefined，着仅更新index指定的子元素，否则认为更新全部元素
            if (this.child && this.posList) {
                this.child.forEach(child => {
                    if (index === undefined || (index !== undefined && child.data.idx == index)) {
                        child.updatePosDate(this.posList)
                    }
                })
            }
        },
        log(data) {
            console.log(data)
        },
        allChildLinked(posList) {
            const pages = getCurrentPages()
            const lastPage = pages[pages.length - 1]
            setTimeout(() => {
                const query = wx.createSelectorQuery()
                query.select('#scroller').scrollOffset().exec((res) => {
                    console.log('rect', res)
                })
            }, 3000)
            

            // console.log('rect', rect)
            let _posList = []
            let height = 0
            let width = 0
            posList.forEach(item => {
                height += item.size.height
                width += item.size.width
            })
            
            let spaceTop = 0
            let spaceLeft = 0
            
            _posList = posList.map(item => {
                item.space = {top: spaceTop, right: width - spaceLeft - item.size.width, bottom: height - spaceTop - item.size.height, left: spaceLeft}
                if (this.data.dragY) {
                    item.space.left = null
                    item.space.right = null
                } else if (this.data.dragX) {
                    item.space.top = null
                    item.space.bottom = null
                }
                spaceTop += item.size.height
                spaceLeft += item.size.width
                return item
            })
            this.posList = _posList
            console.log('posList', this.posList)
            this.noticeChildInited()
        },
        change(data) {
            this.triggerEvent('change', data)
        },
        posChange(data) {
            // console.log('posChange', data)
            this.triggerEvent('poschange', data)
        }
    }
})
