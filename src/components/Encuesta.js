import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Image,
  Input,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tr,
  VStack,
  useRadioGroup,
  useToast,
} from "@chakra-ui/react";
import styles from "./Encuesta.module.css";
import "./test.css";
import CustomRadio from "./CustomRadio";
import axios from "axios";

const Encuesta = () => {
  const toast = useToast();
  const [respuestas, setRespuestas] = useState({
    NombreInstructor: "",
    ManejaContenidoCurso: "",
    UsaGraficosIlustraciones: "",
    DespiertaInteresMetodologia: "",
    BuenaDisposicionAclararDudas: "",
    BuenManejoTerminologiaSAP: "",
    RitmoClasesAdecuado: "",
    CalificacionServicio: "",
    Comercial: "",
    Academico: "",
    Soporte: "",
    RecomendariaITSYSTEMS: "",
    LeGustariaTomarOtroCurso: "",
    OtroCurso: "",
    OtraObservacion: "",
  });
  const [mostrarOtroCurso, setMostrarOtroCurso] = useState(false);
  const [valoraciones, setValoraciones] = useState([]);
  const valoracionIds = valoraciones.map((valoracion) => String(valoracion.id));
  const [isValid, setIsValid] = useState(true);
  const [validacionTabla, setValidacionTabla] = useState(
    Array(valoraciones.length).fill(true)
  );
  const [
    selectedLeGustariaTomarOtroCurso,
    setSelectedLeGustariaTomarOtroCurso,
  ] = useState("");
  const [mostrarBotonBorrar, setMostrarBotonBorrar] = useState(false);
  const [mostrarMensaje, setMostrarMensaje] = useState(false);

  const handleSelectchange = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue) {
      setRespuestas((prevRespuestas) => ({
        ...prevRespuestas,
        NombreInstructor: selectedValue,
      }));
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  };

  const handleTableRadioChange = (value, field, index) => {
    setRespuestas((prevRespuestas) => ({
      ...prevRespuestas,
      [field]: value,
    }));

    setValidacionTabla((prevValidacion) => {
      const nuevasValidaciones = [...prevValidacion];
      nuevasValidaciones[index] = Boolean(value);
      return nuevasValidaciones;
    });
  };

  useEffect(() => {
    const obtenerValoraciones = async () => {
      try {
        const response = await axios.get("http://localhost:3001/rating");
        setValoraciones(response.data);
      } catch (error) {
        console.error("Error al obtener nombres de valoraciones:", error);
      }
    };
    obtenerValoraciones();
  }, []);

  const handleRadioChange = (value) => {
    setRespuestas((prevRespuestas) => ({
      ...prevRespuestas,
      RecomendariaITSYSTEMS: value,
    }));
  };

  const { getRadioProps, getRootProps } = useRadioGroup({
    onChange: handleRadioChange,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Realiza una solicitud POST a la URL del backend con los datos de respuestas
      const response = await axios.post(
        "http://localhost:3001/survey",
        respuestas
      );

      // Verifica si la respuesta del servidor es exitosa (código 2xx)
      if (response.status >= 200 && response.status < 300) {
        // Maneja el éxito aquí
        toast({
          title: "Respuestas enviadas exitosamente",
          status: "success",
          duration: 2000,
        });
        setRespuestas((prevRespuestas) => ({
          ...prevRespuestas,
          NombreInstructor: "",
          ManejaContenidoCurso: "",
          UsaGraficosIlustraciones: "",
          DespiertaInteresMetodologia: "",
          BuenaDisposicionAclararDudas: "",
          BuenManejoTerminologiaSAP: "",
          RitmoClasesAdecuado: "",
          CalificacionServicio: "",
          Comercial: "",
          Academico: "",
          Soporte: "",
          RecomendariaITSYSTEMS: "",
          LeGustariaTomarOtroCurso: "",
          OtroCurso: "",
          OtraObservacion: "",
        }));
        setMostrarOtroCurso(false);
      } else {
        // Maneja errores si la respuesta del servidor no es exitosa
        console.error("Error al enviar respuestas");
        toast({
          title: "Error al enviar respuestas",
          status: "error",
          duration: 2000,
        });
      }
    } catch (error) {
      // Maneja errores de red u otros
      console.error("Error al enviar respuestas:", error.message);
      toast({
        title: "Error al enviar respuestas",
        status: "error",
        duration: 2000,
      });
    }
  };

  return (
    <VStack minH="100vh" py={12} align="center" backgroundColor="#e8edf1">
      <Container maxW="container.md">
        <Box className={styles["heading"]}>
          <Heading>
            <Image
              maxW="100%"
              h="auto"
              borderRadius="8px"
              src="https://lh6.googleusercontent.com/vWiblD7X62Z83cOZ2YHfdrjY9H2dta7inQWuX06oGFaUaLss_EKSUJwgHMW68KQd34DF5jd5a49-8A6iszIoLhnpW7rdtdeimn7OIiL1NJghYrY0HVAbD8NBMXXKRvW4qw=w1258"
            />
          </Heading>
        </Box>

        <Box className={styles["encuesta-container"]}>
          <Text fontSize="5xl" fontWeight="bold" mt={4} textAlign="start">
            ¡NOS GUSTARÍA SABER LO QUE OPINAS!
          </Text>
          <Text textAlign="start">
            Les tomará solo 2 minutos, su respuesta será de mucha utilidad para
            ir mejorando.
          </Text>
          <Text textAlign="start" color="red">
            * Indica que la pregunta es obligatoria
          </Text>
        </Box>

        <form onSubmit={handleSubmit}>
          <Box
            mb={4}
            className={styles["encuesta-container"]}
            borderColor={isValid ? "gray.300" : "red.500"}
          >
            <FormControl mb={4}>
              <FormLabel htmlFor="nombreInstructor" fontWeight="bold">
                Nombre del Instuctor{" "}
                <Text as="span" color="red">
                  *
                </Text>
              </FormLabel>
              <Select
                id="nombreInstructor"
                variant="outline"
                placeholder="Elegir"
                onChange={handleSelectchange}
                required
              >
                <option value="Johnny Cusi"> Johnny Cusi </option>
                <option value="Marco Silva"> Marco Silva </option>
                <option value="Sulca"> Sulca</option>
              </Select>
              {!isValid && (
                <Text textAlign="start" color="red.500" fontSize="sm" mt="2">
                  Debes seleccionar un instructor.
                </Text>
              )}
            </FormControl>
          </Box>

          <Box className={styles["encuesta-container"]}>
            <FormControl mb={4}>
              <Text textAlign="start" fontWeight="bold">
                Teniendo en cuenta la siguiente escala de valoración:
              </Text>
              <Image src="/imagenes/Recurso 2.png" maxW="100%" h="auto" />
            </FormControl>
          </Box>

          <Box className={styles["encuesta-container"]}>
            <FormLabel marginTop="10px" fontWeight="bold">
              Acerca del INSTRUCTOR...{" "}
              <Text as="span" color="red">
                *
              </Text>
            </FormLabel>
            <Box mt={4} className="scrollable-table">
              <Table variant="striped">
                <Thead>
                  <Tr>
                    <Th></Th>
                    {valoraciones.map((valoracion) => (
                      <Th key={valoracion.id}>{valoracion.nombre}</Th>
                    ))}
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td>Maneja el contenido del curso</Td>
                    {valoraciones.map((valoracion, index) => (
                      <Td key={valoracion.id}>
                        <Radio
                          borderColor="gray.500"
                          borderRadius="full"
                          size="lg"
                          colorScheme="teal"
                          isChecked={
                            respuestas.ManejaContenidoCurso ===
                            String(valoracion.id)
                          }
                          onChange={() =>
                            handleTableRadioChange(
                              String(valoracion.id),
                              "ManejaContenidoCurso",
                              index
                            )
                          }
                          value={String(valoracion.id)}
                        />
                      </Td>
                    ))}
                  </Tr>

                  <Tr>
                    <Td>
                      Usa gráficos e ilustraciones para un mejor entendimiento
                    </Td>
                    {valoraciones.map((valoracion, index) => (
                      <Td key={valoracion.id}>
                        <Radio
                          borderColor="gray.500"
                          borderRadius="full"
                          size="lg"
                          colorScheme="teal"
                          isChecked={
                            respuestas.UsaGraficosIlustraciones ===
                            String(valoracion.id)
                          }
                          onChange={() =>
                            handleTableRadioChange(
                              String(valoracion.id),
                              "UsaGraficosIlustraciones",
                              index
                            )
                          }
                          value={String(valoracion.id)}
                        />
                      </Td>
                    ))}
                  </Tr>

                  <Tr>
                    <Td>
                      Despierta su interés y tiene buena metodología de
                      enseñanza
                    </Td>
                    {valoraciones.map((valoracion) => (
                      <Td key={valoracion.id}>
                        <Radio
                          borderColor="gray.500"
                          borderRadius="full"
                          size="lg"
                          colorScheme="teal"
                          isChecked={
                            respuestas.DespiertaInteresMetodologia ===
                            String(valoracion.id)
                          }
                          onChange={() =>
                            setRespuestas((prevRespuestas) => ({
                              ...prevRespuestas,
                              DespiertaInteresMetodologia: String(
                                valoracion.id
                              ),
                            }))
                          }
                          value={String(valoracion.id)}
                        />
                      </Td>
                    ))}
                  </Tr>

                  <Tr>
                    <Td>
                      Tiene buena disposición para recibir y aclarar dudas,
                      opiniones, etc
                    </Td>
                    {valoraciones.map((valoracion) => (
                      <Td key={valoracion.id}>
                        <Radio
                          borderColor="gray.500"
                          borderRadius="full"
                          size="lg"
                          colorScheme="teal"
                          isChecked={
                            respuestas.BuenaDisposicionAclararDudas ===
                            String(valoracion.id)
                          }
                          onChange={() =>
                            setRespuestas((prevRespuestas) => ({
                              ...prevRespuestas,
                              BuenaDisposicionAclararDudas: String(
                                valoracion.id
                              ),
                            }))
                          }
                          value={String(valoracion.id)}
                        />
                      </Td>
                    ))}
                  </Tr>

                  <Tr>
                    <Td>Tiene buen manejo de la terminología SAP</Td>
                    {valoraciones.map((valoracion) => (
                      <Td key={valoracion.id}>
                        <Radio
                          borderColor="gray.500"
                          borderRadius="full"
                          size="lg"
                          colorScheme="teal"
                          isChecked={
                            respuestas.BuenManejoTerminologiaSAP ===
                            String(valoracion.id)
                          }
                          onChange={() =>
                            setRespuestas((prevRespuestas) => ({
                              ...prevRespuestas,
                              BuenManejoTerminologiaSAP: String(valoracion.id),
                            }))
                          }
                          value={String(valoracion.id)}
                        />
                      </Td>
                    ))}
                  </Tr>

                  <Tr>
                    <Td>
                      El ritmo de clases es adecuado para tratar todos los temas
                    </Td>
                    {valoraciones.map((valoracion) => (
                      <Td key={valoracion.id}>
                        <Radio
                          borderColor="gray.500"
                          borderRadius="full"
                          size="lg"
                          colorScheme="teal"
                          isChecked={
                            respuestas.RitmoClasesAdecuado ===
                            String(valoracion.id)
                          }
                          onChange={() =>
                            setRespuestas((prevRespuestas) => ({
                              ...prevRespuestas,
                              RitmoClasesAdecuado: String(valoracion.id),
                            }))
                          }
                          value={String(valoracion.id)}
                        />
                      </Td>
                    ))}
                  </Tr>

                  <Tr>
                    <Td>
                      ¿Cómo calificarías nuestro servicio? (conexión a
                      videoconferencia, presentación, diapositivas, acceso a
                      sap)
                    </Td>
                    {valoraciones.map((valoracion) => (
                      <Td key={valoracion.id}>
                        <Radio
                          borderColor="gray.500"
                          borderRadius="full"
                          size="lg"
                          colorScheme="teal"
                          isChecked={
                            respuestas.CalificacionServicio ===
                            String(valoracion.id)
                          }
                          onChange={() =>
                            setRespuestas((prevRespuestas) => ({
                              ...prevRespuestas,
                              CalificacionServicio: String(valoracion.id),
                            }))
                          }
                          value={String(valoracion.id)}
                        />
                      </Td>
                    ))}
                  </Tr>
                </Tbody>
              </Table>
              {!validacionTabla.every((isValid) => isValid) && (
                <Text textAlign="start" color="red.500" fontSize="sm" mt="2">
                  Debes seleccionar una opción para cada pregunta en la tabla.
                </Text>
              )}
            </Box>
          </Box>
          <Box className={styles["encuesta-container"]}>
            <FormLabel marginTop="10px" fontWeight="bold">
              ¿Cómo valora el trato recibido por el personal que le ha atendido?{" "}
              <Text as="span" color="red">
                *
              </Text>
            </FormLabel>
            <Box mt={4} className="scrollable-table">
              <Table variant="striped">
                <Thead>
                  <Tr>
                    <Th></Th>
                    {valoraciones.map((valoracion) => (
                      <Th key={valoracion.id}>{valoracion.nombre}</Th>
                    ))}
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td>Comercial</Td>
                    {valoraciones.map((valoracion) => (
                      <Td key={valoracion.id}>
                        <Radio
                          borderColor="gray.500"
                          borderRadius="full"
                          size="lg"
                          colorScheme="teal"
                          isChecked={
                            respuestas.Comercial === String(valoracion.id)
                          }
                          onChange={() =>
                            setRespuestas((prevRespuestas) => ({
                              ...prevRespuestas,
                              Comercial: String(valoracion.id),
                            }))
                          }
                          value={String(valoracion.id)}
                        />
                      </Td>
                    ))}
                  </Tr>

                  <Tr>
                    <Td>Academico</Td>
                    {valoraciones.map((valoracion) => (
                      <Td key={valoracion.id}>
                        <Radio
                          borderColor="gray.500"
                          borderRadius="full"
                          size="lg"
                          colorScheme="teal"
                          isChecked={
                            respuestas.Academico === String(valoracion.id)
                          }
                          onChange={() =>
                            setRespuestas((prevRespuestas) => ({
                              ...prevRespuestas,
                              Academico: String(valoracion.id),
                            }))
                          }
                          value={String(valoracion.id)}
                        />
                      </Td>
                    ))}
                  </Tr>

                  <Tr>
                    <Td>Soporte</Td>
                    {valoraciones.map((valoracion) => (
                      <Td key={valoracion.id}>
                        <Radio
                          borderColor="gray.500"
                          borderRadius="full"
                          size="lg"
                          colorScheme="teal"
                          isChecked={
                            respuestas.Soporte === String(valoracion.id)
                          }
                          onChange={() =>
                            setRespuestas((prevRespuestas) => ({
                              ...prevRespuestas,
                              Soporte: String(valoracion.id),
                            }))
                          }
                          value={String(valoracion.id)}
                        />
                      </Td>
                    ))}
                  </Tr>
                </Tbody>
              </Table>
            </Box>
          </Box>
          <Box className={styles["encuesta-container"]}>
            <FormLabel marginTop="10px" fontWeight="bold">
              Recomendarías ITSYSTEMS a tus allegados{" "}
              <Text as="span" color="red">
                *
              </Text>
            </FormLabel>
            <Box className={styles["encuesta-container"]}>
              <Stack direction="row" spacing={5} align="center">
                <VStack>
                  <Text>Totalmente en DESACUERDO</Text>
                </VStack>
                <Stack {...getRootProps()}>
                  <HStack spacing={4}>
                    {valoracionIds.map((valoracion) => (
                      <CustomRadio
                        key={valoracion}
                        label={valoracion}
                        {...getRadioProps({ value: valoracion })}
                      />
                    ))}
                  </HStack>
                </Stack>
                <VStack>
                  <Text>Totalmente de ACUERDO</Text>
                </VStack>
              </Stack>
            </Box>
          </Box>
          <Box className={styles["encuesta-container"]}
          borderColor={!mostrarMensaje ?  "gray.300" : "red.500" }
          >
            <FormLabel marginTop="10px" fontWeight="bold">
              Le gustaría tomar otro curso con nosotros{" "}
              <Text as="span" color="red">
                *
              </Text>
            </FormLabel>
            <Box className={styles["encuesta-container"]}>
              <RadioGroup
                value={selectedLeGustariaTomarOtroCurso}
                onChange={(value) => {
                  setSelectedLeGustariaTomarOtroCurso(value);
                  setRespuestas((prevRespuestas) => ({
                    ...prevRespuestas,
                    LeGustariaTomarOtroCurso: value,
                  }));
                  setMostrarOtroCurso(value === "1");
                  setMostrarBotonBorrar(true);
                  setMostrarMensaje(false)
                  
                }}
              >
                <Stack>
                  <Radio
                    borderColor="gray.500"
                    borderRadius="full"
                    size="lg"
                    value="1"
                  >
                    Si
                  </Radio>
                  <Radio
                    borderColor="gray.500"
                    borderRadius="full"
                    size="lg"
                    value="2"
                  >
                    Quizás
                  </Radio>
                  <Radio
                    borderColor="gray.500"
                    borderRadius="full"
                    size="lg"
                    value="3"
                  >
                    NO
                  </Radio>
                </Stack>
              </RadioGroup>
              {mostrarBotonBorrar && (
                <Box>
                  <Button
                    size="sm"
                    backgroundColor="transparent"
                    fontWeight="normal"
                    onClick={() => {
                      if (selectedLeGustariaTomarOtroCurso) {
                        // Aquí realizas las acciones correspondientes al borrar la selección
                        setSelectedLeGustariaTomarOtroCurso("");
                        setRespuestas({
                          ...respuestas,
                          LeGustariaTomarOtroCurso: "",
                        });
                        setMostrarOtroCurso(false);
                        setMostrarBotonBorrar(false);
                        setMostrarMensaje(true);

                      } else {
                        setMostrarMensaje(false)
                      }
                    }}
                  >
                    Borrar selección
                  </Button>
                  
                </Box>
              )}
              {mostrarMensaje && (
                    <Text textAlign="start" color="red.500" fontSize="sm" mt="2">
                      Debes seleccionar una opción antes de borrar.
                    </Text>
                  )}
            </Box>
          </Box>
          {mostrarOtroCurso && (
            <Box className={styles["encuesta-container"]}>
              <FormControl>
                <FormLabel marginTop="10px" fontWeight="bold">
                  Sobre lo anterior, si su respuesta fue SÍ, que otro curso le
                  gustaría llevar con nosotros{" "}
                  <Text as="span" color="red">
                    {" "}
                    *
                  </Text>
                </FormLabel>
                <Input
                  type="text"
                  placeholder="Tu Respuesta"
                  onChange={(e) => {
                    setRespuestas((prevRespuestas) => ({
                      ...prevRespuestas,
                      OtroCurso: e.target.value,
                    }));
                  }}
                />
              </FormControl>
            </Box>
          )}
          <Box className={styles["encuesta-container"]}>
            <FormControl id="comments" mb={4}>
              <FormLabel marginTop="10px" fontWeight="bold">
                Por favor, déjenos saber sus observaciones y/o sugerencias
                acerca de su experiencia con nosotros
              </FormLabel>
              <Textarea
                placeholder="Tu Respuesta"
                onChange={(e) => {
                  setRespuestas((prevRespuestas) => ({
                    ...prevRespuestas,
                    OtraObservacion: e.target.value,
                  }));
                }}
              />
            </FormControl>
          </Box>
          <Box mt={4} display="flex" flex="start" marginTop="20px">
            <Button colorScheme="teal" type="submit">
              Enviar
            </Button>
          </Box>
        </form>
      </Container>
    </VStack>
  );
};

export default Encuesta;
