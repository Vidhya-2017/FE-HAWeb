// import React from 'react';

const SelectStyles = (width = 200, maxWidth = 215) => {
  const defaultStyle = {
    control: styles => ({
      ...styles,
      backgroundColor: 'rgba(255, 255, 255, 0.12)',
      minWidth: width,
      maxWidth: maxWidth,
      minHeight: 40,
      borderColor: '#000',
      borderRadius: '5px',
      marginBottom: '3px',
      marginRight: '10px',
      outline: 'transparent',
      boxShadow: 'none',
      ':hover': {
        borderColor: '#000000',
        boxShadow: '0 0 0 1px #000000',
      },
      ':active': {
        borderColor: '#000000',
        boxShadow: '0 0 0 1px #000000',
      },
      ':focus': {
        borderColor: '#000000',
        boxShadow: '0 0 0 1px #000000'
      }
    }),
      menu: styles => ({ 
        ...styles, 
        backgroundColor: '#fff',
      zIndex: 1000,
      border: '1px solid #999' }),
        indicatorSeparator: styles => ({ ...styles, backgroundColor: 'none' }),
          option: (styles, { isFocused, isSelected }) => {
            return {
              ...styles,
              backgroundColor: '#fff',
              ':active': {
                backgroundColor: '#eee',
              },
              ':hover': {
                backgroundColor: '#dadada',
              },
              ':focus': {
                backgroundColor: '#eee',
              },
              color: isSelected ? '#000' : '#333'
            }
          }
  }
  return defaultStyle;
};

export default SelectStyles;