export const getDayOfWeek = (n) => {
    const days = {
      'Janeiro': 'Jan',
      'Fevereiro': 'Fev',
      'Março': 'Mar',
      'Abril': 'Abr',
      'Maio': 'Maio',
      'Junho': 'Jun',
      'Julho': 'Jul',
      'Agosto': 'Ago',
      'Setembro': 'Set',
      'Outubro': 'Out',
      'Novembro': 'Nov',
      'Dezembro': 'Dez',
    };

    return days[n] || '';
}