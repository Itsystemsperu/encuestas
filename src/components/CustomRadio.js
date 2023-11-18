import { Box, useRadio, chakra } from "@chakra-ui/react";


function CustomRadio(props) {
    const { label, ...radioProps } = props;
    const { state, getInputProps, getRadioProps, htmlProps } = useRadio(radioProps);

    return (
      <chakra.label {...htmlProps} cursor='pointer'>
        <input {...getInputProps()} hidden />
        {label}
        <Box
          {...getRadioProps()}
          position='relative'
        width='24px'
        height='24px'
        borderRadius='full'
        border='2px solid'
        overflow='hidden'
        
        >
            <chakra.div
          bg={state.isChecked ? 'teal' : 'transparent'}
          position='absolute'
          top='50%'
          left='50%'
          transform='translate(-50%, -50%)'
          borderRadius='full'
          width='12px'
          height='12px'
        />
          
        </Box>
      </chakra.label>
    );
  }
export default CustomRadio;
