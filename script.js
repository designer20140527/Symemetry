document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.header');
    let lastScroll = 0;
    let scrollTimer;

    // 滚动处理函数
    const handleScroll = () => {
        const currentScroll = window.pageYOffset;
        
        // 添加节流，防止频繁触发
        if (scrollTimer) {
            clearTimeout(scrollTimer);
        }
        
        scrollTimer = setTimeout(() => {
            if (currentScroll > 50) {
                if (!header.classList.contains('scrolled')) {
                    header.classList.add('scrolled');
                }
            } else {
                if (header.classList.contains('scrolled')) {
                    header.classList.remove('scrolled');
                }
            }
            lastScroll = currentScroll;
        }, 10);
    };

    // 添加滚动监听
    window.addEventListener('scroll', handleScroll);
    
    // 初始检查滚动位置
    handleScroll();

    // 添加滚动动画
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.animate-on-scroll');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            
            if (elementTop < window.innerHeight && elementBottom > 0) {
                element.classList.add('animated');
            }
        });
    };

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();

    // FAQ交互
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        question.addEventListener('click', () => {
            // 关闭其他打开的FAQ
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-answer').style.maxHeight = null;
                }
            });
            
            // 切换当前FAQ的状态
            item.classList.toggle('active');
            
            // 动画展开/收起
            if (item.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + "px";
            } else {
                answer.style.maxHeight = null;
            }
        });
    });

    const benefitsGrid = document.querySelector('.benefits-grid');
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;

    benefitsGrid.addEventListener('mousedown', dragStart);
    benefitsGrid.addEventListener('touchstart', dragStart);
    benefitsGrid.addEventListener('mouseup', dragEnd);
    benefitsGrid.addEventListener('touchend', dragEnd);
    benefitsGrid.addEventListener('mousemove', drag);
    benefitsGrid.addEventListener('touchmove', drag);
    benefitsGrid.addEventListener('mouseleave', dragEnd);

    function dragStart(e) {
        isDragging = true;
        startPos = getPositionX(e);
        benefitsGrid.style.cursor = 'grabbing';
    }

    function drag(e) {
        if (!isDragging) return;
        e.preventDefault();
        const currentPosition = getPositionX(e);
        const diff = currentPosition - startPos;
        currentTranslate = prevTranslate + diff;
        
        // 限制滑动范围
        const maxTranslate = 0;
        const minTranslate = -(benefitsGrid.offsetWidth * 0.25);  // 只允许滑动一个卡片的宽度
        currentTranslate = Math.max(Math.min(currentTranslate, maxTranslate), minTranslate);
        
        setTransform(currentTranslate);
    }

    function dragEnd() {
        isDragging = false;
        prevTranslate = currentTranslate;
        benefitsGrid.style.cursor = 'grab';
    }

    function getPositionX(e) {
        return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
    }

    function setTransform(x) {
        benefitsGrid.style.transform = `translateX(${x}px)`;
    }

    // 添加滑动功能
    const techGrid = document.querySelector('.tech-grid');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentPosition = 0;
    const cardWidth = techGrid.offsetWidth / 3;

    function updateSlideButtons() {
        prevBtn.style.opacity = currentPosition === 0 ? '0.5' : '1';
        nextBtn.style.opacity = currentPosition === -cardWidth ? '0.5' : '1';
        prevBtn.disabled = currentPosition === 0;
        nextBtn.disabled = currentPosition === -cardWidth;
    }

    function slide(direction) {
        if (direction === 'next' && currentPosition > -cardWidth) {
            currentPosition -= cardWidth;
        } else if (direction === 'prev' && currentPosition < 0) {
            currentPosition += cardWidth;
        }
        techGrid.style.transform = `translateX(${currentPosition}px)`;
        updateSlideButtons();
    }

    prevBtn.addEventListener('click', () => slide('prev'));
    nextBtn.addEventListener('click', () => slide('next'));
    
    // 初始化按钮状态
    updateSlideButtons();

    // Token Allocation Chart
    const ctx = document.getElementById('tokenAllocationChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: [
                'Liquidity Pools',
                'Governance & Community',
                'Team & Advisors',
                'SYM Node Plan',
                'Marketing & Partnerships'
            ],
            datasets: [{
                data: [65, 10, 5, 15, 5],
                backgroundColor: [
                    'rgb(0, 220, 130)',  // --accent-green
                    '#4CAF50',
                    '#2196F3',
                    '#9C27B0',
                    '#FF9800'
                ],
                borderWidth: 0,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            cutout: '70%',
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

    // 更新滚动逻辑
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                
                // 特殊处理顶部滚动
                if (this.getAttribute('href') === '#top') {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                } 
                // 特殊处理introduction部分
                else if (this.getAttribute('href') === '#introduction') {
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
                    window.scrollTo({
                        top: targetPosition - (headerHeight + 20), // 额外增加20px的空间
                        behavior: 'smooth'
                    });
                }
                // 其他section的滚动
                else {
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
                    window.scrollTo({
                        top: targetPosition - headerHeight,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}); 