
$(".slick-end").slick({
  lazyLoad: "ondemand",
  arrows: false,
  dots: false,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
});



    /* Requisitos: jQuery e Slick já carregados na página antes deste script */
    jQuery(function ($) {
        const $root = $('.slick-slider').first();
        if (!$root.length) return console.warn('Slider root não encontrado: .slick-slider');

        // Tenta localizar o container real dos slides
        let $slidesContainer = $root.find('.slick-track').first();
       
        if (!$slidesContainer.length) {
            $slidesContainer = $root.find('.slick-list').first();
        }
        if (!$slidesContainer.length) {
            return console.warn('Container dos slides não encontrado (.slick-track  / .slick-list).');
        }

        // Os botões/dots externos já existentes no HTML
        const $prevBtn = $('.control-button.left');
        const $nextBtn = $('.control-button.right');
        const $playPause = $('.control-button.center');
        

        // Se o elemento selecionado for .slick-track (gerado pelo slick previamente),
        // precisamos inicializar o Slick no PAI que contém as slides originais.
        // Normalmente .slick-track contém .slick-slide — vamos checar se suas "slides"
        let $slickInitTarget = $slidesContainer;

        // Caso .slick-track exista e suas crianças já contenham classe .slick-slide,
        // Slick pode já ter sido inicializado anteriormente. Para evitar conflito,
        // inicializaremos no elemento pai que contém os slides originais (se for seguro).
        if ($slidesContainer.hasClass('slick-track') && $slidesContainer.children().length > 0) {
            // Procurar um elemento pai sem as classes do Slick para inicializar de forma limpa.
            const $candidate = $slidesContainer.closest('.slick-list, .slick-slider').children().not('.slick-track, .slick-list').first();
            if ($candidate.length && $candidate.children().length >= $slidesContainer.children().length) {
                // se encontrar um candidato plausível, usa ele; senão, usa o próprio track (fallback)
                $slickInitTarget = $candidate.length ? $candidate : $slidesContainer;
            } else {
                // fallback: usa o próprio track
                $slickInitTarget = $slidesContainer;
            }
        }

        // Se o target já tem slick inicializado, zera antes (evita double-init)
        if ($slickInitTarget.hasClass('slick-initialized')) {
            try {
                $slickInitTarget.slick('unslick'); // remove instancia antiga
            } catch (err) {
                console.warn('Falha ao desmontar instancia Slick anterior (pode ser ok):', err);
            }
        }

        // Inicializa o slick
        $slickInitTarget.slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            infinite: true,
            dots: false,       // NÃO criar dots automáticos — usaremos os do HTML
            arrows: false,     // NÃO usar setas internas
            autoplay: true,
            autoplaySpeed: 3000,
            pauseOnHover: true,
            accessibility: true,
            adaptiveHeight: false
        });

        // --- Botões externos ---
        $prevBtn.off('click.slickCustom').on('click.slickCustom', function (e) {
            e.preventDefault();
            $slickInitTarget.slick('slickPrev');
        });

        $nextBtn.off('click.slickCustom').on('click.slickCustom', function (e) {
            e.preventDefault();
            $slickInitTarget.slick('slickNext');
        });

        // --- Play / Pause central ---
        let isPlaying = true;
        if ($playPause.hasClass('paused')) isPlaying = false;

        $playPause.off('click.slickCustom').on('click.slickCustom', function (e) {
            e.preventDefault();
            if (isPlaying) {
                $slickInitTarget.slick('slickPause');
                $(this).removeClass('playing').addClass('paused').attr('aria-label', 'Start autoplay');
                $(this).find('img').attr('src', 'https://i02.appmifile.com/mi-com-product/fly-birds/poco-c85/pc/play-aria-img.png');
            } else {
                $slickInitTarget.slick('slickPlay');
                $(this).removeClass('paused').addClass('playing').attr('aria-label', 'Stop autoplay');
                $(this).find('img').attr('src', 'https://i02.appmifile.com/mi-com-product/fly-birds/poco-c85/pc/pause-aria-img.png');
            }
            isPlaying = !isPlaying;
        });

        // --- Dots externos (conectar UL/LI existentes) ---
        if ($existingDots.length) {
            // ligar click nos LI
            $existingDots.find('li').each(function (idx) {
                $(this).off('click.slickDot').on('click.slickDot', function (e) {
                    e.preventDefault();
                    $slickInitTarget.slick('slickGoTo', idx);
                });
            });

            // sincroniza as classes active quando slide muda
            $slickInitTarget.on('afterChange.slickCustom', function (event, slick, currentSlide) {
                $existingDots.find('li').removeClass('slick-active').eq(currentSlide).addClass('slick-active');
            });

            // definir o dot inicial ativo (após inicialização do slick)
            const initialIndex = $slickInitTarget.slick('slickCurrentSlide') || 0;
            $existingDots.find('li').removeClass('slick-active').eq(initialIndex).addClass('slick-active');
        } else {
            console.warn('Nenhum .slick-dots encontrado dentro de .slick-slider; dots não serão sincronizados.');
        }

        // Se houver navegação por teclado ou mudança externa, manter dots em sincronia:
        $slickInitTarget.on('swipe.slick keyup.slick', function () {
            const cur = $slickInitTarget.slick('slickCurrentSlide');
            if ($existingDots.length) {
                $existingDots.find('li').removeClass('slick-active').eq(cur).addClass('slick-active');
            }
        });

        // Logs para ajudar debug
        console.log('Slick inicializado em:', $slickInitTarget[0]);
        console.log('Slides count:', $slickInitTarget.find('.slick-slide').length);
    });

