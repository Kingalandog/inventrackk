-- =============================================
-- InvenTrack - Base de Datos
-- Sistema de Gestión de Inventario
-- Estándar: ISO/IEC 25000
-- =============================================

CREATE DATABASE IF NOT EXISTS inventrackk;
USE inventrackk;

-- ── TABLA: categorias ─────────────────────────
CREATE TABLE categorias (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  nombre    VARCHAR(50) NOT NULL,
  descripcion TEXT
);

-- ── TABLA: proveedores ────────────────────────
CREATE TABLE proveedores (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  nombre    VARCHAR(100) NOT NULL,
  contacto  VARCHAR(100),
  telefono  VARCHAR(20),
  email     VARCHAR(100)
);

-- ── TABLA: productos ──────────────────────────
CREATE TABLE productos (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  codigo        VARCHAR(10) UNIQUE NOT NULL,
  nombre        VARCHAR(100) NOT NULL,
  categoria_id  INT,
  proveedor_id  INT,
  stock         INT DEFAULT 0,
  stock_minimo  INT DEFAULT 5,
  precio        DECIMAL(12,2) DEFAULT 0,
  fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (categoria_id) REFERENCES categorias(id),
  FOREIGN KEY (proveedor_id) REFERENCES proveedores(id)
);

-- ── TABLA: movimientos ────────────────────────
CREATE TABLE movimientos (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  producto_id INT,
  tipo        ENUM('entrada','salida') NOT NULL,
  cantidad    INT NOT NULL,
  fecha       DATETIME DEFAULT CURRENT_TIMESTAMP,
  observacion TEXT,
  FOREIGN KEY (producto_id) REFERENCES productos(id)
);

-- ── DATOS DE EJEMPLO ──────────────────────────
INSERT INTO categorias (nombre, descripcion) VALUES
('Electrónica',  'Equipos y accesorios electrónicos'),
('Papelería',    'Útiles de oficina y papelería'),
('Herramientas', 'Herramientas de trabajo'),
('Limpieza',     'Productos de aseo e higiene'),
('Insumos',      'Insumos generales');

INSERT INTO proveedores (nombre, contacto, telefono, email) VALUES
('Dell Colombia',      'Juan Pérez',   '3001234567', 'ventas@dell.com.co'),
('Logitech SAS',       'Ana Gómez',    '3019876543', 'ventas@logitech.co'),
('Papelería Central',  'Luis Torres',  '3105554433', 'pedidos@papcentral.co'),
('HP Inc.',            'María Ruiz',   '3187776655', 'ventas@hp.com.co'),
('Makita Colombia',    'Carlos Díaz',  '3209998877', 'info@makita.com.co');

INSERT INTO productos (codigo, nombre, categoria_id, proveedor_id, stock, stock_minimo, precio) VALUES
('P001', 'Laptop Dell Inspiron',   1, 1, 12, 5,  2800000),
('P002', 'Mouse Inalámbrico',      1, 2, 45, 10,   85000),
('P003', 'Resma Papel A4',         2, 3,  3, 20,   18000),
('P004', 'Tóner Impresora HP',     1, 4,  0,  3,  320000),
('P005', 'Taladro Percutor',       3, 5,  8,  4,  245000),
('P006', 'Detergente Industrial',  4, 1, 30, 10,   25000),
('P007', 'Cuadernos 100h',         2, 3,  4, 15,    8500),
('P008', 'Cable HDMI 2m',          1, 2, 22,  8,   32000);

INSERT INTO movimientos (producto_id, tipo, cantidad, observacion) VALUES
(1, 'entrada', 12, 'Compra inicial'),
(2, 'entrada', 50, 'Compra inicial'),
(2, 'salida',   5, 'Entrega a oficina'),
(3, 'entrada', 20, 'Compra inicial'),
(3, 'salida',  17, 'Distribución áreas'),
(4, 'entrada',  3, 'Compra inicial'),
(4, 'salida',   3, 'Reemplazo impresoras');