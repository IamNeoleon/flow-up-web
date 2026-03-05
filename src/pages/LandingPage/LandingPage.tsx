import { PageControls } from "@/shared/ui/PageControls";
import { Header } from "@/widgets/Header/ui/Header";
import { Intro } from "./sections/Intro";
import { useTranslation } from "react-i18next";
import { useTitle } from "@/shared/hooks/use-title";
import { WhyBlock } from "./sections/WhyBlock";
import { Features } from "./sections/Features";
import { Feedback } from "./sections/Feedback";
import { Footer } from "@/widgets/Footer/ui/Footer";

const LandingPage = () => {
   const { t } = useTranslation();
   useTitle(t('common.slogan') ?? '')

   return (
      <div className="wrapper">
         <Header />
         <Intro />
         <WhyBlock />
         <Features />
         <Feedback />
         <Footer />
         <PageControls />
      </div>
   );
};

export default LandingPage;