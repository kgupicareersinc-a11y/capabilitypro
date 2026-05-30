import { useState } from 'react';
import { Search, PlusCircle, Star } from 'lucide-react';
import { TEMPLATES_CONFIG, TemplateStyle } from '../initialData';

interface GalleryViewProps {
  onSelectTemplate: (templateId: string) => void;
  onCustomBuilder: () => void;
}

export default function GalleryView({ onSelectTemplate, onCustomBuilder }: GalleryViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // South African specific categories maps
  const categories = ['All', 'Corporate', 'Government Tender', 'Construction', 'ICT'];

  const filteredTemplates = TEMPLATES_CONFIG.filter(template => {
    // Category match
    const categoryLower = selectedCategory.toLowerCase();
    let matchesCategory = true;
    
    if (categoryLower !== 'all') {
      if (categoryLower === 'corporate') {
        matchesCategory = template.id === 'corporate' || template.id === 'boutique';
      } else if (categoryLower === 'government tender') {
        matchesCategory = template.id === 'tender';
      } else if (categoryLower === 'construction') {
        matchesCategory = template.id === 'infrabuild';
      } else if (categoryLower === 'ict') {
        matchesCategory = template.id === 'digital';
      }
    }

    // Search query match
    const matchesSearch = 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      template.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full bg-[#f6faff] min-h-screen pt-10 pb-20 px-4 md:px-8 max-w-[1440px] mx-auto" id="gallery-root">
      
      {/* Gallery Header */}
      <section className="mb-10 text-left">
        <h1 className="font-sans font-bold text-3xl md:text-4xl text-[#000e27] mb-2">
          Template Gallery
        </h1>
        <p className="text-slate-600 font-sans text-sm md:text-base max-w-3xl leading-relaxed">
          Select a professionally curated Capability Statement template designed to meet the rigorous compliance standards of South African municipal, provincial, and national procurement boards.
        </p>
      </section>

      {/* Sticky Filters row */}
      <section className="sticky top-16 z-40 bg-[#f6faff]/95 backdrop-blur-md py-4 mb-10 flex flex-col md:flex-row gap-4 justify-between items-center border-b border-slate-100">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
          <input 
            type="text"
            placeholder="Search templates..."
            className="w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0453cd]/20 focus:border-[#0453cd] outline-none bg-white font-sans text-sm transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            id="gallery-search-input"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-full font-sans text-xs font-semibold border transition-all active:scale-95 ${
                selectedCategory === cat
                  ? 'bg-[#0453cd] text-white border-transparent shadow'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
              id={`gallery-cat-pill-${cat.replace(/\s+/g, '-').toLowerCase()}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Grid containing templates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTemplates.map(template => (
          <div 
            key={template.id}
            className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
            id={`gallery-card-${template.id}`}
          >
            {/* Template image display layer */}
            <div className="relative aspect-[3/4] overflow-hidden bg-slate-100 border-b border-slate-100">
              <img 
                src={template.imageUrl}
                alt={template.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              
              {/* Overlay with launch hover logic */}
              <div className="absolute inset-0 bg-[#000e27]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 px-4">
                <button 
                  onClick={() => onSelectTemplate(template.id)}
                  className="bg-white text-[#000e27] hover:bg-[#0453cd] hover:text-white px-4 py-2 rounded-lg font-sans font-bold text-xs shadow transition-all active:scale-95"
                >
                  Use Template
                </button>
              </div>

              {/* Tag badges */}
              {template.id === 'corporate' && (
                <div className="absolute top-3 right-3 bg-[#000e27] text-white text-[10px] font-extrabold uppercase px-2.5 py-1 tracking-wider rounded shadow-sm">
                  Premium
                </div>
              )}
              {template.id === 'tender' && (
                <div className="absolute top-3 left-3 bg-emerald-700 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 tracking-wider rounded shadow-sm">
                  BEE Level 1 Focus
                </div>
              )}
              {template.id === 'infrabuild' && (
                <div className="absolute top-3 right-3 bg-[#e05e00] text-white text-[10px] font-extrabold uppercase px-2.5 py-1 tracking-wider rounded shadow-sm">
                  CIVIL / CIDB Ready
                </div>
              )}
            </div>

            {/* Template text descriptions */}
            <div className="p-4 flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-sans font-bold text-[#000e27] text-base leading-tight group-hover:text-[#0453cd] transition-colors">
                  {template.name}
                </h3>
                <Star className="h-4.5 w-4.5 text-slate-300 hover:text-amber-500 cursor-pointer fill-transparent hover:fill-amber-500 transition-colors" />
              </div>
              <p className="text-xs text-slate-500 leading-normal font-sans mb-4 flex-grow">
                {template.description}
              </p>
              
              <div className="mt-auto">
                <button 
                  onClick={() => onSelectTemplate(template.id)}
                  className="w-full bg-[#000e27] hover:bg-slate-800 text-white py-2 rounded-lg font-sans font-bold text-xs tracking-wide shadow-sm hover:shadow active:scale-95 transition-all"
                >
                  Select Template
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Custom Builder placeholder */}
        <div 
          onClick={onCustomBuilder}
          className="border-2 border-dashed border-slate-300 hover:border-[#0453cd] rounded-xl flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:bg-white hover:shadow-md transition-all group"
          id="gallery-custom-builder-card"
        >
          <PlusCircle className="h-10 w-10 text-slate-400 group-hover:text-[#0453cd] mb-3 transition-colors shrink-0" />
          <h3 className="font-sans font-bold text-base text-[#000e27] mb-1.5">
            Custom Builder
          </h3>
          <p className="text-xs text-slate-500 font-sans max-w-[210px] leading-relaxed mb-4">
            Have direct branding requirements? Build a bespoke layout specification from scratch.
          </p>
          <button 
            type="button"
            className="text-xs font-bold text-[#0453cd] group-hover:underline font-sans"
          >
            Launch Editor
          </button>
        </div>
      </div>

    </div>
  );
}
