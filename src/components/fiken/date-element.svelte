<script lang="ts">
  import { format } from "date-fns";
  import { nb } from "date-fns/locale/nb";

  interface Props {
    date: Date;
  }

  let { date }: Props = $props();
</script>

<time datetime={format(date, "yyyy-MM-dd")}>
  {format(date, "dd. MMM yyyy", { locale: nb })}
</time>
