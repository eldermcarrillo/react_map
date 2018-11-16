-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 17-11-2018 a las 00:00:49
-- Versión del servidor: 10.1.36-MariaDB
-- Versión de PHP: 7.1.23

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `bdgooglemap`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `markers`
--

CREATE TABLE `markers` (
  `id` int(11) NOT NULL,
  `name` varchar(200) COLLATE utf8_bin NOT NULL,
  `lat` double NOT NULL,
  `lng` double NOT NULL,
  `categoria` varchar(20) COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Volcado de datos para la tabla `markers`
--

INSERT INTO `markers` (`id`, `name`, `lat`, `lng`, `categoria`) VALUES
(109, 'dina 22', 11.507934019896, -85.278038785421, 'Dinamico'),
(110, 'dinacontenido', 12.539468075146, -85.519738004171, 'Dinamico'),
(111, 'est1', 12.619887501447, -85.569176480734, 'Estatico'),
(112, 'q', 13.47609271849, -86.014122769796, 'Estatico'),
(113, 'w', 12.759221239438, -83.838829801046, 'Estatico'),
(114, 'e', 12.263704934834, -85.435341619473, 'Estatico'),
(115, 'r', 11.511160603994, -83.056801580411, 'Estatico'),
(116, 't', 10.751201243539, -85.160683416348, 'Estatico'),
(117, 'qwe', 13.059063196562, -86.442589566671, 'Dinamico'),
(118, 'qwe', 12.067173204499, -84.300255582296, 'Dinamico'),
(119, 'qweqwe', 13.080466660592, -86.612877652609, 'Dinamico'),
(120, 'qweqweqweqwe', 12.855638182451, -85.404381558859, 'Dinamico'),
(121, 'elder', 12.759221239438, -84.728722379171, 'Estatico'),
(122, 'qweqweqweqweqweqweqweqweqwe', 12.518018647221, -85.481285855734, 'Estatico'),
(123, 'luis', 13.299744564368, -83.053307340109, 'Estatico'),
(124, 'julio', 12.528743584234, -86.986412808859, 'Estatico'),
(125, 'luis2', 12.31416056022, -83.135704801046, 'Estatico'),
(126, 'luis3', 13.3959504844, -86.728234097921, 'Estatico'),
(127, 'luis4', 11.895221282537, -86.596398160421, 'Estatico'),
(129, '21', 13.411981072447, -84.585900113546, 'Estatico'),
(133, 'asdasd', 12.968077816554, -84.234337613546, 'Estatico'),
(134, 'werwerwer', 13.000194115428, -85.558190152609, 'Estatico'),
(135, '123123123123', 12.292692553785, -85.871300504171, 'Estatico');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `points`
--

CREATE TABLE `points` (
  `id` int(11) NOT NULL,
  `lat` double NOT NULL,
  `lng` double NOT NULL,
  `id_polygons` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Volcado de datos para la tabla `points`
--

INSERT INTO `points` (`id`, `lat`, `lng`, `id_polygons`) VALUES
(1, 12.88776895095, -85.690026090109, 1),
(2, 12.416109564599, -85.684532926046, 1),
(3, 12.394649923612, -85.157189176046, 1),
(4, 12.877059152335, -85.162682340109, 1),
(5, 12.866348896051, -85.657067105734, 1),
(6, 13.315781544134, -84.193138883078, 2),
(7, 13.155364137752, -83.630089566671, 2),
(8, 12.652048206515, -84.327721402609, 2),
(9, 13.278360274227, -84.201378629171, 2),
(10, 12.93060356162, -83.322472379171, 3),
(11, 12.416109564599, -83.300499722921, 3),
(12, 12.421474198491, -83.756432340109, 3),
(13, 12.882414108874, -83.800377652609, 3),
(14, 13.05371204064, -83.635582730734, 3),
(15, 13.310436002189, -83.163170621359, 3),
(32, 11.518699284857, -86.983666226828, 6),
(33, 11.147061944174, -86.61562423464, 6),
(34, 11.534846409329, -86.494774625265, 6),
(35, 11.577900864482, -86.692528531515, 6);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `polygons`
--

CREATE TABLE `polygons` (
  `id` int(11) NOT NULL,
  `name` varchar(20) COLLATE utf8_bin NOT NULL,
  `color` varchar(20) COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Volcado de datos para la tabla `polygons`
--

INSERT INTO `polygons` (`id`, `name`, `color`) VALUES
(1, 'Cuadrado', '#9013FE'),
(2, 'triangulo', '#7ed321'),
(3, 'otro', '#1078f1'),
(6, 'ssss', '#9013FE');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `markers`
--
ALTER TABLE `markers`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `points`
--
ALTER TABLE `points`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `polygons`
--
ALTER TABLE `polygons`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `markers`
--
ALTER TABLE `markers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=140;

--
-- AUTO_INCREMENT de la tabla `points`
--
ALTER TABLE `points`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT de la tabla `polygons`
--
ALTER TABLE `polygons`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
