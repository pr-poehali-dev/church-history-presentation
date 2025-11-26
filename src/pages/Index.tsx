import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const slides = [
    {
      title: 'Церковь Сен-Севэн в Пуату',
      subtitle: 'Жемчужина романской архитектуры XI века',
      type: 'title',
      image: 'https://cdn.poehali.dev/projects/58b36c61-aef8-4248-a8c4-2a11fb01f4ee/files/4d56c0c5-2941-492e-9018-bb03c0381fec.jpg'
    },
    {
      title: 'История создания',
      type: 'history',
      content: [
        {
          year: 'IX век',
          event: 'Основание аббатства',
          description: 'Церковь была основана в эпоху Каролингов на месте древнего святилища'
        },
        {
          year: '1023 год',
          event: 'Начало строительства',
          description: 'Граф Пуату начал возведение новой романской церкви'
        },
        {
          year: '1040 год',
          event: 'Завершение строительства',
          description: 'Основные работы по возведению церкви были завершены'
        },
        {
          year: 'XI век',
          event: 'Создание фресок',
          description: 'Роспись сводов церкви была выполнена византийскими мастерами'
        },
        {
          year: '1983 год',
          event: 'Признание ЮНЕСКО',
          description: 'Церковь внесена в список Всемирного наследия'
        }
      ]
    },
    {
      title: 'Архитектурные особенности',
      type: 'architecture',
      image: 'https://cdn.poehali.dev/projects/58b36c61-aef8-4248-a8c4-2a11fb01f4ee/files/89d837b0-9891-4692-8f33-0dc64999ffb7.jpg',
      features: [
        {
          icon: 'Church',
          title: 'Романский стиль',
          description: 'Типичный образец романской архитектуры с массивными стенами и полукруглыми арками'
        },
        {
          icon: 'Columns',
          title: 'Колонны',
          description: 'Изящные колонны с резными капителями, украшенными растительными орнаментами'
        },
        {
          icon: 'Home',
          title: 'Базилика',
          description: 'Трёхнефная базилика длиной 76 метров с высокими цилиндрическими сводами'
        },
        {
          icon: 'Crown',
          title: 'Колокольня',
          description: 'Квадратная колокольня высотой 35 метров в западной части церкви'
        }
      ]
    },
    {
      title: 'Интересные факты',
      type: 'facts',
      image: 'https://cdn.poehali.dev/projects/58b36c61-aef8-4248-a8c4-2a11fb01f4ee/files/cc9a5718-45bb-4fe0-a4d1-fde5d395ab69.jpg',
      facts: [
        {
          icon: 'Palette',
          title: 'Уникальные фрески',
          text: 'Церковь содержит самый большой ансамбль романских фресок во Франции — более 400 м² росписей на библейские сюжеты'
        },
        {
          icon: 'Paintbrush',
          title: 'Цветовая палитра',
          text: 'Фрески выполнены всего пятью цветами: белым, чёрным, красным, жёлтым и зелёным на охристом фоне'
        },
        {
          icon: 'BookOpen',
          title: 'Библейские сцены',
          text: 'На сводах изображены сцены из Ветхого Завета: история Адама и Евы, строительство Вавилонской башни, история Иосифа'
        },
        {
          icon: 'Map',
          title: 'Путь Святого Иакова',
          text: 'Церковь находится на одном из маршрутов паломничества в Сантьяго-де-Компостела'
        },
        {
          icon: 'Shield',
          title: 'Сохранность',
          text: 'Благодаря сухому климату и толстым стенам фрески прекрасно сохранились за почти 1000 лет'
        }
      ]
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const exportToPDF = async () => {
    setIsExporting(true);
    toast({ title: 'Начинаю экспорт...', description: 'Пожалуйста, подождите' });

    try {
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const slideElements = document.querySelectorAll('.slide-content');

      for (let i = 0; i < slides.length; i++) {
        setCurrentSlide(i);
        await new Promise(resolve => setTimeout(resolve, 500));

        const slideElement = slideElements[i] as HTMLElement;
        if (slideElement) {
          const canvas = await html2canvas(slideElement, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#F5EFE7'
          });

          const imgData = canvas.toDataURL('image/jpeg', 0.9);
          const imgWidth = 297;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          if (i > 0) pdf.addPage();
          pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
        }
      }

      pdf.save('Церковь-Сен-Севэн.pdf');
      toast({ title: 'Готово!', description: 'PDF успешно сохранён' });
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось создать PDF', variant: 'destructive' });
    } finally {
      setIsExporting(false);
      setCurrentSlide(0);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && currentSlide < slides.length - 1) {
        nextSlide();
      } else if (e.key === 'ArrowLeft' && currentSlide > 0) {
        prevSlide();
      } else if (e.key === 'Escape' && document.fullscreenElement) {
        document.exitFullscreen();
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [currentSlide, slides.length]);

  const currentData = slides[currentSlide];

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-[#F5EFE7] via-[#E8DCC8] to-[#D4C5B9] relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')]"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <div className="flex gap-2">
            <Button
              onClick={toggleFullscreen}
              variant="outline"
              size="sm"
              className="font-crimson bg-[#FAF8F3] border-2 border-[#8B7355] text-[#3E2723] hover:bg-[#B8860B] hover:text-[#F5EFE7] hover:border-[#B8860B] transition-all duration-300"
              title="Полноэкранный режим (или нажмите F11)"
            >
              <Icon name={isFullscreen ? 'Minimize2' : 'Maximize2'} size={16} className="mr-1" />
              {isFullscreen ? 'Выход' : 'Полный экран'}
            </Button>
            <Button
              onClick={exportToPDF}
              disabled={isExporting}
              variant="outline"
              size="sm"
              className="font-crimson bg-[#FAF8F3] border-2 border-[#8B7355] text-[#3E2723] hover:bg-[#B8860B] hover:text-[#F5EFE7] hover:border-[#B8860B] disabled:opacity-50 transition-all duration-300"
              title="Сохранить презентацию в PDF"
            >
              <Icon name={isExporting ? 'Loader2' : 'Download'} size={16} className={`mr-1 ${isExporting ? 'animate-spin' : ''}`} />
              {isExporting ? 'Экспорт...' : 'Скачать PDF'}
            </Button>
          </div>
          <div className="flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentSlide === index 
                    ? 'bg-[#B8860B] w-8' 
                    : 'bg-[#8B7355] hover:bg-[#B8860B]'
                }`}
                aria-label={`Слайд ${index + 1}`}
              />
            ))}
          </div>
          <div className="text-[#3E2723] font-crimson text-sm">
            {currentSlide + 1} / {slides.length}
          </div>
        </div>

        <div className="animate-fade-in slide-content">
          {currentData.type === 'title' && (
            <div className="text-center py-20">
              <div className="mb-12">
                <div className="inline-block mb-6">
                  <div className="w-16 h-1 bg-[#B8860B] mx-auto mb-6"></div>
                  <Icon name="Church" size={64} className="text-[#B8860B] mx-auto mb-6" />
                  <div className="w-16 h-1 bg-[#B8860B] mx-auto"></div>
                </div>
                <h1 className="font-cormorant text-6xl md:text-7xl font-bold text-[#3E2723] mb-6 tracking-wide">
                  {currentData.title}
                </h1>
                <p className="font-crimson text-2xl text-[#5D4037] italic mb-12">
                  {currentData.subtitle}
                </p>
              </div>
              <div className="relative max-w-4xl mx-auto rounded-lg overflow-hidden shadow-2xl border-8 border-[#8B7355]">
                <img 
                  src={currentData.image} 
                  alt="Церковь Сен-Севэн" 
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
            </div>
          )}

          {currentData.type === 'history' && (
            <div className="py-12">
              <h2 className="font-cormorant text-5xl font-bold text-center text-[#3E2723] mb-12">
                <Icon name="Clock" size={48} className="inline-block mr-4 text-[#B8860B]" />
                {currentData.title}
              </h2>
              <div className="relative">
                <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-[#B8860B] opacity-30"></div>
                <div className="space-y-8">
                  {currentData.content.map((item, index) => (
                    <div 
                      key={index} 
                      className={`flex items-center gap-8 ${
                        index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                      }`}
                      style={{ animationDelay: `${index * 0.2}s` }}
                    >
                      <Card className={`flex-1 p-6 bg-[#FAF8F3] border-2 border-[#D4C5B9] shadow-lg hover:shadow-xl transition-shadow duration-300 ${
                        index % 2 === 0 ? 'text-right' : 'text-left'
                      }`}>
                        <div className="mb-2">
                          <span className="font-cormorant text-3xl font-bold text-[#B8860B]">
                            {item.year}
                          </span>
                        </div>
                        <h3 className="font-cormorant text-2xl font-semibold text-[#3E2723] mb-2">
                          {item.event}
                        </h3>
                        <p className="font-crimson text-[#5D4037] leading-relaxed">
                          {item.description}
                        </p>
                      </Card>
                      <div className="w-8 h-8 rounded-full bg-[#B8860B] border-4 border-[#F5EFE7] z-10 flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-[#F5EFE7]"></div>
                      </div>
                      <div className="flex-1"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentData.type === 'architecture' && (
            <div className="py-12">
              <h2 className="font-cormorant text-5xl font-bold text-center text-[#3E2723] mb-12">
                <Icon name="Building2" size={48} className="inline-block mr-4 text-[#B8860B]" />
                {currentData.title}
              </h2>
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="relative rounded-lg overflow-hidden shadow-2xl border-4 border-[#8B7355]">
                  <img 
                    src={currentData.image} 
                    alt="Архитектура" 
                    className="w-full h-full object-cover min-h-[400px]"
                  />
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {currentData.features.map((feature, index) => (
                    <Card 
                      key={index}
                      className="p-6 bg-[#FAF8F3] border-2 border-[#D4C5B9] hover:border-[#B8860B] transition-all duration-300 hover:shadow-lg"
                      style={{ animationDelay: `${index * 0.15}s` }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#B8860B] flex items-center justify-center flex-shrink-0">
                          <Icon name={feature.icon} size={24} className="text-[#F5EFE7]" />
                        </div>
                        <div>
                          <h3 className="font-cormorant text-2xl font-semibold text-[#3E2723] mb-2">
                            {feature.title}
                          </h3>
                          <p className="font-crimson text-[#5D4037] leading-relaxed">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentData.type === 'facts' && (
            <div className="py-12">
              <h2 className="font-cormorant text-5xl font-bold text-center text-[#3E2723] mb-12">
                <Icon name="Sparkles" size={48} className="inline-block mr-4 text-[#B8860B]" />
                {currentData.title}
              </h2>
              <div className="mb-8 relative rounded-lg overflow-hidden shadow-2xl border-4 border-[#8B7355] max-w-4xl mx-auto">
                <img 
                  src={currentData.image} 
                  alt="Фрески" 
                  className="w-full h-[300px] object-cover"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {currentData.facts.map((fact, index) => (
                  <Card 
                    key={index}
                    className="p-6 bg-[#FAF8F3] border-2 border-[#D4C5B9] hover:border-[#B8860B] transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#B8860B] to-[#8B7355] flex items-center justify-center flex-shrink-0">
                        <Icon name={fact.icon} size={24} className="text-[#F5EFE7]" />
                      </div>
                      <div>
                        <h3 className="font-cormorant text-xl font-semibold text-[#3E2723] mb-2">
                          {fact.title}
                        </h3>
                        <p className="font-crimson text-[#5D4037] leading-relaxed">
                          {fact.text}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mt-12">
          <Button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            variant="outline"
            size="lg"
            className="font-crimson bg-[#FAF8F3] border-2 border-[#8B7355] text-[#3E2723] hover:bg-[#B8860B] hover:text-[#F5EFE7] hover:border-[#B8860B] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            <Icon name="ChevronLeft" size={20} className="mr-2" />
            Назад
          </Button>
          <Button
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            variant="outline"
            size="lg"
            className="font-crimson bg-[#FAF8F3] border-2 border-[#8B7355] text-[#3E2723] hover:bg-[#B8860B] hover:text-[#F5EFE7] hover:border-[#B8860B] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            Вперёд
            <Icon name="ChevronRight" size={20} className="ml-2" />
          </Button>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 text-[#3E2723] font-crimson text-sm opacity-50">
        Презентация по истории
      </div>
    </div>
  );
};

export default Index;