import SessionGuard from "@/app/components/guard/SessionGuard";
import FileDashboard from "@/app/shared/file/dashboard";
import { metaObject } from "@/config/site.config";

export const metadata = {
  ...metaObject(),
};

export default function FileDashboardPage({
  params: { lang },
}: {
  params: {
    lang: string;
  };
}) {
  return <>
    <SessionGuard lang={lang}>
      <FileDashboard lang={lang} />;
    </SessionGuard>
  </>;
}
