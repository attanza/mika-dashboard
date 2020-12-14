import { Component, Vue } from 'vue-property-decorator';

interface IDateShortcut {
  text: string;
  onClick: Function;
}

@Component
export default class DatePickerShortcutMixin extends Vue {
  dates: Array<Date> | null = null;

  generateShortcut() {
    const days = ['today', 'yesterday', 'this week', 'this month', 'last week', 'last month'];
    let shortcut: IDateShortcut[] = [];
    days.map(d => {
      shortcut.push({
        text: d,
        onClick: () => {
          this.dates = this.generateData(d);
        },
      });
    });
    return shortcut;
  }
  generateData(type: string): Array<Date> | null {
    switch (type) {
      case 'today':
        return [
          this.$moment()
            .startOf('day')
            .toDate(),
          this.$moment()
            .endOf('day')
            .toDate(),
        ];

      case 'yesterday':
        return [
          this.$moment()
            .startOf('day')
            .subtract(1, 'days')
            .toDate(),
          this.$moment()
            .startOf('day')
            .toDate(),
        ];

      case 'this week':
        return [
          this.$moment()
            .startOf('week')
            .toDate(),
          this.$moment()
            .endOf('week')
            .toDate(),
        ];

      case 'this month':
        return [
          this.$moment()
            .startOf('month')
            .toDate(),
          this.$moment()
            .endOf('month')
            .toDate(),
        ];

      case 'last week':
        return [
          this.$moment()
            .startOf('week')
            .subtract(1, 'weeks')
            .toDate(),
          this.$moment()
            .startOf('week')
            .toDate(),
        ];

      case 'last month':
        return [
          this.$moment()
            .startOf('month')
            .subtract(1, 'months')
            .toDate(),
          this.$moment()
            .startOf('month')
            .toDate(),
        ];

      default:
        return null;
    }
  }
}
