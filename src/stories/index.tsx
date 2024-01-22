import React, { CSSProperties, ReactElement } from 'react';
import { useTooltipController } from './index.controller';
import './index.styles.css';

export interface TooltipProps {
  /**
   * Initial content styles
   */
  defaultValue?: Pick<
    CSSProperties,
    'fontFamily' | 'fontSize' | 'color' | 'textDecoration' | 'fontWeight' | 'fontStyle'
  >;
  /**
   * Event emit
   */
  fireEvent: 'click' | 'hover'| 'none';
  /**
   * Element content
   */
  label: ReactElement | string | number;
  /**
   * Font size list
   */
  sizes?: {
    [Symbol in string]: number;
  };
  /**
   * Font family list check in `https://fonts.googleapis.com` for more info
   */
  fonts?: {
    [Symbol in string]: string;
  };
  /**
   * On style change event handler
   */
  onStyleChanged?: (value: CSSProperties) => void;
  /**
   * Enable size option
   */
  withSize?: boolean;
  /**
   * Enable font color option
   */
  withColor?: boolean;
  /**
   * Enable text decoration option
   */
  withDecoration?: boolean;
}

/**
 * Primary UI component for user interaction
 */
const Tooltip = ({
  label,
  withColor = true,
  withDecoration = true,
  withSize = true,
  fireEvent = 'click',
  ...args
}: TooltipProps) => {
  const {
    fonts,
    sizes,
    toggle,
    containerProps,
    tooltipHoverHandler,
    fontFamilyHandler,
    fontSizeHandler,
    colorHandler,
    colorPreviewStyles,
    fontWeightHandler,
    textDecorationHandler,
    fontStyleHandler,
    style,
  } = useTooltipController({
    ...args,
    withColor,
    withDecoration,
    withSize,
    fireEvent,
  });

  const tooltipModal = (
    <>
      {toggle && (
        <div onMouseOver={tooltipHoverHandler} className="tooltip-content">
          <div
            onClick={(e) => e.stopPropagation()}
            className="tooltip-content-container"
          >
            <div>
              <select
                style={{
                  fontFamily: 'sans-serif',
                  textDecoration: 'none',
                  fontWeight: 'normal',
                  fontStyle: 'normal',
                }}
                value={style.fontFamily}
                onChange={fontFamilyHandler}
                className="tooltip-custom-select"
              >
                {Object.keys(fonts).map((item, key) => (
                  <option
                    style={{
                      fontFamily: fonts[item],
                      textDecoration: 'none',
                      fontWeight: 'normal',
                      fontStyle: 'normal',
                    }}
                    key={key}
                    label={item.toString()}
                    value={fonts[item]}
                  />
                ))}
              </select>
            </div>
            {withSize && (
              <div>
                <select
                  style={{
                    fontFamily: 'sans-serif',
                    textDecoration: 'none',
                    fontWeight: 'normal',
                    fontStyle: 'normal',
                  }}
                  value={style.fontSize}
                  onChange={fontSizeHandler}
                  className="tooltip-custom-select"
                >
                  {Object.keys(sizes).map((item, key) => (
                    <option
                      style={{
                        fontFamily: 'sans-serif',
                        textDecoration: 'none',
                        fontWeight: 'normal',
                        fontStyle: 'normal',
                      }}
                      key={key}
                      label={item.toString()}
                      value={sizes[item]}
                    />
                  ))}
                </select>
              </div>
            )}
            {withDecoration && (
              <div className="tooltip-label-style">
                <label
                  onClick={fontWeightHandler}
                  className="tooltip-label tooltip-label-bold"
                >
                  B
                </label>
                <label
                  onClick={fontStyleHandler}
                  className="tooltip-label tooltip-label-italic"
                >
                  i
                </label>
                <label
                  onClick={textDecorationHandler}
                  className="tooltip-label tooltip-label-underline"
                >
                  S
                </label>
              </div>
            )}
            {withColor && (
              <div className="tooltip-color-picker">
                <input
                  onChange={colorHandler}
                  type="color"
                  className="tooltip-custom-color-input"
                />
                <div
                  style={{
                    ...colorPreviewStyles,
                  }}
                  className="tooltip-color-preview"
                ></div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );

  const element =
    typeof label !== 'string' && typeof label !== 'number' ? (
      React.cloneElement(
        label,
        {
          className: 'tooltip-label',
          style,
          ...containerProps,
        },
        <>
          {label.props.children}
          {tooltipModal}
        </>
      )
    ) : (
      <div className="tooltip-label" style={{ ...style }} {...containerProps}>
        {label}
        {tooltipModal}
      </div>
    );

  return element;
};

export default Tooltip;
