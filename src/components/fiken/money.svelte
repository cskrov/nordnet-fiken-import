<script lang="ts">
  import { prettyFormatMoney } from "@app/lib/money";

  interface Props {
    amount: number;
    reversed?: boolean;
  }

  let { amount, reversed = false }: Props = $props();

  const getClass = (value: number) => {
    switch (Math.sign(value)) {
      case 0:
        return "zero";
      case -1:
        return reversed ? "positive" : "negative";
      case 1:
        return reversed ? "negative" : "positive";
    }
  };
</script>

<span class={getClass(amount)}>{prettyFormatMoney(amount)}</span>

<style>
  .positive {
    color: lightgreen;
  }

  .negative {
    color: orangered;
  }

  .zero {
    color: darkgray;
  }
</style>
