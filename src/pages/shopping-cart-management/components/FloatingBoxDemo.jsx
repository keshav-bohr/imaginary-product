import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FloatingBoxDemo = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [quote, setQuote] = useState(null);

  const modalRef = React.useRef();

  const fetchRandomQuote = async () => {
    try {
      const response = await fetch('https://thequoteshub.com/api/random');
      const data = await response.json();
      setQuote(data?.text);
    } catch (error) {
      console.error('Error fetching quote:', error);
    }
  }

  const clickOutsideModalHandler = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setShowModal(false);
      setQuote(null);
    }
  };

  useEffect(() => {
    if (showModal) {
      document.addEventListener("mousedown", clickOutsideModalHandler);
    }

    return () => {
      document.removeEventListener("mousedown", clickOutsideModalHandler);
    }
  }, [showModal, clickOutsideModalHandler]);

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6">
      <div className="flex items-start gap-3 mb-4">
        <Icon name="Layers" size={24} color="var(--color-warning)" className="flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-base md:text-lg font-semibold text-foreground mb-2">
            Floating Boxes Demo
          </h3>
        </div>
      </div>
      <div className="space-y-6">
        <div 
          className="relative bg-primary/10 p-4 rounded-lg"
          style={{ transform: 'translateZ(0)' }}
        >
          
          <div className="relative">
            <Button
              onClick={() => setShowDropdown(!showDropdown)}
              variant="outline"
              size="sm"
              iconName="ChevronDown"
              iconPosition="right"
            >
              Features
            </Button>
            
            {showDropdown && (
              <div 
                className="absolute top-full left-0 mt-2 w-64 bg-card border border-border rounded-lg shadow-lg p-4"
                style={{ zIndex: 9999 }}
              >
                <p className="text-sm text-foreground mb-2">Analytics</p>
                <p className="text-xs text-muted-foreground">
                  GTM
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="relative h-40 bg-muted/30 rounded-lg">
          <div 
            className="absolute top-4 left-4 w-32 h-32 bg-error/80 rounded-lg flex items-center justify-center text-white text-sm font-semibold"
            style={{ zIndex: 1 }}
          >
            Box 1<br/>(z: 1)
          </div>
          
          <div 
            className="absolute top-8 left-20 w-32 h-32 bg-warning/80 rounded-lg flex items-center justify-center text-white text-sm font-semibold"
            style={{ zIndex: 'auto' }}
          >
            Box 2<br/>(z: auto)
          </div>
          
          <div 
            className="absolute top-12 left-36 w-32 h-32 bg-success/80 rounded-lg flex items-center justify-center text-white text-sm font-semibold"
            style={{ zIndex: 10 }}
          >
            Box 3<br/>(z: 10)
          </div>

          <button
            className="absolute bottom-4 right-4 bg-primary text-white px-4 py-2 rounded-lg text-sm"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            style={{ zIndex: 5 }}
            onClick={fetchRandomQuote}
          >
            Assessment Note
          </button>
          
          {showTooltip && (
            <div 
              className="absolute bottom-16 right-4 bg-foreground text-background px-3 py-2 rounded text-xs whitespace-nowrap"
              style={{ zIndex: 100 }}
            >
              Integrate with real quote api https://thequoteshub.com/api/
              <div 
                className="absolute top-full right-4 w-0 h-0"
                style={{
                  borderLeft: '6px solid transparent',
                  borderRight: '6px solid transparent',
                  borderTop: '6px solid var(--color-foreground)'
                }}
              />
            </div>
          )}
        </div>

        <div>
          <Button
            onClick={() => {
              fetchRandomQuote();
              setShowModal(true);
            }}
            variant="primary"
            size="sm"
            id="open-modal-btn"
          >
            Random Quote
          </Button>
          
          {showModal && (
            <div 
              className="fixed inset-0 bg-black/50 flex items-center justify-center"
              style={{ zIndex: 50 }}
              >
              <div 
                className="bg-card border border-border rounded-lg p-6 max-w-md"
                onClick={(e) => alert('Modal content clicked!')}
                ref={modalRef}
              >
                <h4 className="text-lg font-semibold text-foreground mb-2">Random Quote</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  {quote || 'Loading...'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FloatingBoxDemo;