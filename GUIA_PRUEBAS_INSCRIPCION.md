# 🧪 Guía de Pruebas - Inscripción de Participantes

## ✅ **Datos de Prueba Válidos Confirmados**

Los siguientes usuarios están **operativos y validados** para probar la inscripción exitosa:

### 👥 **Participantes de Prueba**

1. **Juan Carlos Pérez González**
   - RUT: `12.345.678-5` ✅
   - Empresa: Cualquier empresa contratista
   - Estado: Validación exitosa confirmada

2. **María Elena Rodríguez Silva**
   - RUT: `98.765.432-5` ✅ 
   - Empresa: Cualquier empresa contratista
   - Estado: Validación exitosa confirmada

3. **Carlos Alberto Muñoz Torres**
   - RUT: `15.678.234-3` ✅
   - Empresa: Cualquier empresa contratista
   - Estado: Validación exitosa confirmada

## 🔧 **Correcciones Realizadas**

### Problema Identificado
- Los RUTs originales no pasaban la validación módulo 11 chilena
- `98.765.432-1` → Corregido a `98.765.432-5`
- `15.678.234-9` → Corregido a `15.678.234-3`

### Archivos Actualizados
- ✅ `ManualEnrollmentForm.tsx` - Datos de prueba en modal
- ✅ `mockData.ts` - Usuarios y participantes
- ✅ `LoginForm.tsx` - Información de usuarios de prueba

## 🧪 **Pasos para Probar la Inscripción**

### 1. **Acceder al Sistema**
```
URL: http://localhost:5174
Usuario: 22.222.222-2 (Contratista)
Clave: 1234
```

### 2. **Navegar a Inscripción**
1. Ir a "Mis Cursos" en el menú lateral
2. Seleccionar cualquier curso del calendario
3. Hacer clic en "Inscripción Manual"

### 3. **Probar Inscripción Exitosa**

**Participante 1:**
```
Nombre Completo: Juan Carlos Pérez González
RUT: 12.345.678-5
Empresa Contratista: Constructora ABC Ltda.
```

**Participante 2:**
```
Nombre Completo: María Elena Rodríguez Silva
RUT: 98.765.432-5
Empresa Contratista: Empresa XYZ S.A.
```

**Participante 3:**
```
Nombre Completo: Carlos Alberto Muñoz Torres
RUT: 15.678.234-3
Empresa Contratista: Contratista DEF Ltda.
```

### 4. **Validaciones que Deben Funcionar**

✅ **RUT Válido**: Los 3 RUTs pasan la validación módulo 11
✅ **Nombre-RUT**: Combinación nombre/RUT validada correctamente
✅ **Sin Duplicados**: No permite inscribir el mismo RUT dos veces
✅ **Campos Requeridos**: Todos los campos son obligatorios

## 🎯 **Resultados Esperados**

### ✅ **Inscripción Exitosa**
- Modal se cierra automáticamente
- Participante aparece en la lista del curso
- Mensaje de confirmación (si implementado)
- Butaca asignada en el mapa de asientos

### ❌ **Validaciones de Error**
- RUT inválido: Mensaje "Dígito verificador incorrecto"
- RUT duplicado: "Este RUT ya está inscrito en el curso"
- Nombre incorrecto: "El nombre no pertenece al RUT"
- Campos vacíos: Mensajes de campo requerido

## 🔍 **Verificación Visual**

### Modal de Inscripción
- ✅ Muestra datos de prueba válidos en la parte superior
- ✅ Campos con tipografía consistente (Inter/Roboto)
- ✅ Botones con nueva paleta de colores
- ✅ Mensajes de error en rojo (#D32F2F)
- ✅ Focus states accesibles

### Formulario
- ✅ Altura mínima uniforme (44px) en campos
- ✅ Espaciado consistente (24px entre campos)
- ✅ Bordes redondeados de 4px
- ✅ Validación en tiempo real del RUT

## 🚀 **Estado del Sistema**

- **Aplicación**: Corriendo en http://localhost:5174
- **Base de datos**: Inicializada con datos de prueba
- **Validaciones**: Funcionando correctamente
- **UI/UX**: Refactorizada con nueva paleta
- **Accesibilidad**: WCAG 2.2 AA implementado

## 📝 **Notas Importantes**

1. **RUTs Reales**: Los RUTs de prueba son válidos según algoritmo chileno
2. **Nombres Exactos**: Usar los nombres exactos para validación exitosa
3. **Empresas**: Cualquier nombre de empresa es válido
4. **Capacidad**: Verificar que el curso tenga cupos disponibles
5. **Duplicados**: El sistema previene inscripciones duplicadas

---

**✅ Sistema listo para demostración y testing completo**

*Última actualización: Datos de prueba validados y operativos*
