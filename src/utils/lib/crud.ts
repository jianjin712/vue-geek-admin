export function CrudHandler(type) {
  const enumType = {
    text: 'text',
    textarea: ['textarea', 'colspan'],
    'image-uploader': 'image-uploader',
  };
  if (enumType && enumType.hasOwnProperty(type)) {
    return enumType[type];
  }
}
