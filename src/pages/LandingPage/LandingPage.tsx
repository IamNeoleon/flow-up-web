import { PageControls } from "@/shared/ui/PageControls";
import { Header } from "@/widgets/Header/ui/Header";
import { Intro } from "./sections/Intro";
import { useTranslation } from "react-i18next";
import { useTitle } from "@/shared/hooks/use-title";

const LandingPage = () => {
   const { t } = useTranslation();
   useTitle(t('common.slogan') ?? '')

   return (
      <div className="wrapper">
         <Header />
         <Intro />
         <PageControls />
      </div>
   );
};

export default LandingPage;