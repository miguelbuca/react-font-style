import {
  CSSProperties,
  HTMLAttributes,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { TooltipProps } from '.';

export const useTooltipController = (args?: Omit<TooltipProps, 'label'>) => {
  const [toggle, setToggle] = useState(false);
  const [fontFamily, setFontFamily] = useState<string>(
    args?.defaultValue?.fontFamily || ''
  );
  const [fontSize, setFontSize] = useState<number | string>(
    args?.defaultValue?.fontSize || 16
  );
  const [color, setColor] = useState(args?.defaultValue?.color || '#000');
  const [fontWeight, setFontWeight] = useState<'normal' | 'bold'>(
    (args?.defaultValue?.fontWeight as 'normal' | 'bold') || 'normal'
  );
  const [fontStyle, setFontStyle] = useState<'normal' | 'italic'>(
    (args?.defaultValue?.fontStyle as 'normal' | 'italic') || 'normal'
  );
  const [textDecoration, setTextDecoration] = useState<'none' | 'underline'>(
    (args?.defaultValue?.textDecoration as 'none' | 'underline') || 'none'
  );

  const [fonts, setFonts] = useState<
    {
      [Symbol in string]: string;
    }
  >({
    Roboto: 'Roboto+sans-serif',
    'Open Sans': 'Open Sans+sans-serif',
    Lato: 'Lato, sans-serif',
    Montserrat: 'Montserrat, sans-serif',
    Poppins: 'Poppins, sans-serif',
    'Source Sans Pro': 'Source Sans Pro, sans-serif',
    Ubuntu: 'Ubuntu, sans-serif',
    Oswald: 'Oswald, sans-serif',
    'Roboto Condensed': 'Roboto Condensed, sans-serif',
    'Playfair Display': 'Playfair Display, serif',
    Merriweather: 'Merriweather, serif',
    Quicksand: 'Quicksand, sans-serif',
    'Josefin Sans': 'Josefin Sans, sans-serif',
    'Montserrat Alternates': 'Montserrat Alternates, sans-serif',
    Oxygen: 'Oxygen, sans-serif',
    Raleway: 'Raleway, sans-serif',
    'Titillium Web': 'Titillium Web, sans-serif',
    'Varela Round': 'Varela Round, sans-serif',
    Archivo: 'Archivo, sans-serif',
    Cabin: 'Cabin, sans-serif',
    'Advent Pro': 'Advent Pro, cursive',
    'Black Ops One': 'Black Ops One, cursive',
    Cookie: 'Cookie, cursive',
    Dosis: 'Dosis, cursive',
    'Great Vibes': 'Great Vibes, cursive',
    'Indie Flower': 'Indie Flower, cursive',
    'Kaushan Script': 'Kaushan Script, cursive',
    Lobster: 'Lobster, cursive',
    Pacifico: 'Pacifico, cursive',
    Sacramento: 'Sacramento, cursive',
  });
  const [sizes, setSizes] = useState<
    {
      [Symbol in string]: number;
    }
  >({
    8: 8,
    9: 9,
    10: 10,
    11: 11,
    12: 12,
    14: 14,
    16: 16,
    18: 18,
    20: 20,
    22: 22,
    24: 24,
    26: 26,
    28: 28,
    36: 36,
    48: 48,
    72: 72,
  });

  useEffect(() => {
    args?.sizes && setSizes(args.sizes);
    args?.fonts && setFonts(args.fonts);
  }, [args]);

  const link = useMemo(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css?family=${Object.keys(
      fonts
    ).join('|')}`;

    return link;
  }, [fonts]);

  useEffect(() => {
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    }
  }, [link]);

  const style: CSSProperties = useMemo(() => {
    return {
      fontFamily,
      fontSize,
      fontStyle,
      textDecoration,
      fontWeight,
      color,
    };
  }, [fontFamily, fontSize, fontStyle, textDecoration, color, fontWeight]);

  const toggleHandler = (state?: boolean) =>
    setToggle(prev => (state !== undefined ? state : !prev));

  const containerProps: Pick<
    HTMLAttributes<HTMLDivElement>,
    'onClick' | 'onMouseOver' | 'onMouseLeave' | 'onDoubleClick' | 'className'
  > = {
    className: 'tooltip-container',
    onClick:
      args?.fireEvent === 'click' ? () => toggleHandler(!toggle) : undefined,
    onMouseOver:
      args?.fireEvent === 'hover' ? () => toggleHandler(true) : undefined,
    onMouseLeave: () => toggleHandler(false),
    onDoubleClick: () => toggleHandler(false),
  };

  const colorPreviewStyles: CSSProperties = {
    backgroundColor: color,
  };

  const tooltipHoverHandler = () => toggleHandler(true);

  const fontFamilyHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFontFamily(e.target.value);
    toggleHandler(false);
  };

  const fontSizeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFontSize(parseFloat(e.target.value));
    toggleHandler(false);
  };

  const colorHandler = (e: React.ChangeEvent<HTMLInputElement>) =>
    setColor(e.target.value);

  const fontWeightHandler = () =>
    setFontWeight(prev => (prev === 'bold' ? 'normal' : 'bold'));

  const textDecorationHandler = () =>
    setTextDecoration(prev => (prev === 'underline' ? 'none' : 'underline'));

  const fontStyleHandler = () =>
    setFontStyle(prev => (prev === 'italic' ? 'normal' : 'italic'));

  useEffect(() => {
    args?.onStyleChanged?.(style);
  }, [style]);

  return {
    fonts,
    sizes,
    style,
    toggle,
    toggleHandler,
    containerProps,
    tooltipHoverHandler,
    fontFamilyHandler,
    fontSizeHandler,
    colorPreviewStyles,
    colorHandler,
    fontWeightHandler,
    textDecorationHandler,
    fontStyleHandler,
  };
};
