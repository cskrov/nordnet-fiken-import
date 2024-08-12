<script lang="ts">
  import { prettyFormatMoney } from "@app/lib/money";

  interface Props {
    amount: number;
    reversed?: boolean;
  }

  let { amount, reversed = false }: Props = $props();

  const className = $derived.by(() => {
    switch (Math.sign(amount)) {
      case 0:
        return "zero";
      case -1:
        return reversed ? "positive" : "negative";
      case 1:
        return reversed ? "negative" : "positive";
    }
  });

  const prettyAmount = $derived(prettyFormatMoney(amount));
</script>

<span class={className}>{prettyAmount}</span>

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
