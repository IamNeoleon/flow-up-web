import { useState } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { Burger } from "./Burger";
import { MainLogo } from "@/shared/ui/MainLogo";
import { Button } from "@/shared/ui/shadcn/button";
import { cn } from "@/shared/utils/cn";
import { routes } from "@/shared/routes";

const menu = [
   {
      key: 'why',
   },
   {
      key: 'features',
   },
   {
      key: 'preview',
   }
]

export const Header = () => {
   const { t } = useTranslation();
   const [openMenu, setOpenMenu] = useState<boolean>(false)

   return (
      <header className="absolute top-0 left-0 z-100 w-full py-4 border-b">
         <div className="container mx-auto flex justify-between items-center">
            <Link to={'/'}>
               <MainLogo />
            </Link>
            <div className={cn(
               'flex items-center gap-10',
               'max-sm:fixed max-sm:bg-background',
               'max-sm:w-full max-sm:h-full max-sm:flex-col',
               'max-sm:top-[75px] max-sm:left-0 max-sm:gap-7 max-sm:-translate-x-full transition-transform',
               openMenu && 'max-sm:translate-x-0'
            )}>
               <nav className="relative">
                  <ul className="
                     flex gap-10 font-medium text-base
                     max-sm:flex-col max-sm:text-center
                     max-sm:pt-10 max-sm:gap-7 max-sm:text-xl
                     max-sm:font-semibold
                  ">
                     {menu.map((item) => (
                        <li key={item.key}>
                           <a
                              href="/"
                              className="
                                 relative
                                 after:absolute
                                 after:left-0
                                 after:-bottom-1.5
                                 after:h-0.5
                                 after:w-full
                                 after:bg-primary
                                 after:origin-center
                                 after:scale-x-0
                                 after:transition-transform
                                 after:duration-300
                                 hover:after:scale-x-100
                                 hover:text-primary
                                 transition-colors
                              "
                           >
                              {t(`headerMenu.${item.key}`)}
                           </a>
                        </li>
                     ))}
                  </ul>
               </nav>
               <Link to={routes.home()}>
                  <Button className="max-sm:w-3xs max-sm:py-5 max-sm:text-base">
                     {t('common.getStarted')}
                  </Button>
               </Link>
            </div>
            <div className="sm:hidden">
               <Burger open={openMenu} setOpen={setOpenMenu} />
            </div>
         </div>
      </header>
   );
};
