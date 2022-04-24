const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);



const main = $('.main')
const sidebarItems = $$('.sidebar__nav-item')
const sidebarSubnav = $('.sidebar__subnav')
const sidebar = $('.sidebar')
const subnavItems = Array.from($$('.sidebar__subnav-item'))
const expandSubnavBtn = $('.sidebar__item-icon.btn--expand-subnav')
const sidebarExpandBtn = $('.header__container-btn.btn--expand')


const app = {
    isShrinkSidebar: false,
    isExpandSubnav: false,
    suvnavHeight: 0,
    currentSidebarWidth: 250,

    calSubnavHeight() {
        return Array.from(subnavItems).reduce((acc, subnavItem) => {
            return acc + subnavItem.offsetHeight
        }, 0)
    },

    handleEvents() {
        const _this = this


        // Handle expand sub navigation
        function expandSubnav() {
            if (!_this.isShrinkSidebar) {
                sidebarSubnav.style.height = _this.calSubnavHeight() + 'px';
            }
            sidebarSubnav.classList.add('expand')
            expandSubnavBtn.classList.add('expand')
        }

        // Handle close sub navigation
        function closeSubnav() {
            if (!_this.isShrinkSidebar) {
                sidebarSubnav.style.height = 0;
            }
            sidebarSubnav.classList.remove('expand')
            expandSubnavBtn.classList.remove('expand')
        }


        // Handle shrink sidebar
        function shrinkSidebar() {
            if(window.innerWidth >= 740) {
                _this.currentSidebarWidth = 50;
            } else {
                _this.currentSidebarWidth = 0;
            }
            main.classList.add('has--shrink-sidebar')
            document.documentElement.style.setProperty('--sidebar-width', _this.currentSidebarWidth + 'px')
            sidebarSubnav.style.removeProperty('height')
            
            _this.isExpandSubnav = false
            closeSubnav()
        }

        // Handle expand sidebar
        function expandSidebar() {
            main.classList.remove('has--shrink-sidebar')
            _this.currentSidebarWidth = 250
            document.documentElement.style.setProperty('--sidebar-width', _this.currentSidebarWidth + 'px')
        }


        // Handle when click on sub navigation
        sidebarSubnav.onclick = function (e) {
            e.stopPropagation()
        }

        // Handle when click on sidebar navigation
        sidebarItems.forEach((sidebarItem, index) => {
            if (index === 0) {
                // First sidebar navigation item
                sidebarItem.onclick = (e) => {
                    this.isExpandSubnav = !this.isExpandSubnav
                    this.isExpandSubnav ? expandSubnav() : closeSubnav()
                }
            }
            if (index === 1) {
                // Second sidebar navigation item
                sidebarItem.onclick = (e) => {
                    this.isExpandSubnav = false
                    closeSubnav()
                }
            }
        })

        


        // Handle expand and shrink sidebar
        sidebarExpandBtn.onclick = (e) => {
            this.isShrinkSidebar = !this.isShrinkSidebar
            this.isShrinkSidebar ? shrinkSidebar() : expandSidebar()
        }

        // Handle when hover on shrink navigation item
        sidebarItems[0].onmouseover = (e) => {
            document.documentElement.style.setProperty('--subnav-height', this.calSubnavHeight() + 'px')
        }

        // Handle when resize window
        window.onresize = (e) => {
            if(window.innerWidth < 740) {
                this.isShrinkSidebar = true;
            } else {
                this.isShrinkSidebar = false
            }

            this.isShrinkSidebar ? shrinkSidebar() : expandSidebar()
        }

        // Handle close sidebar when click on outside area of sidebar
        document.onclick = (e) => {
            const expandBtn = e.target.closest('.header__container-btn')
            const sidebar = e.target.closest('.sidebar')
            const headerHomeBtn = e.target.closest('.header__sidebar-logo')
            if(!expandBtn && !sidebar && !headerHomeBtn) {
                if(window.innerWidth < 740) {
                    this.isShrinkSidebar = true;
                    shrinkSidebar()
                }
            }
        }

        // Set up initial close sidebar when start
        ;(function setUpInitial() {
            document.documentElement.style.setProperty('--subnav-height', _this.calSubnavHeight() + 'px')
            if(window.innerWidth < 740) {
                sidebar.style.display = 'none';
                setTimeout(function() {
                    sidebar.style.display = 'initial';
                }, 300)
                _this.isShrinkSidebar = true;
                shrinkSidebar()
            }
        })()

    },


    start() {
        // Listening / Handle DOM events
        this.handleEvents()
    }
}

app.start()

