import Button from '@material-ui/core/Button';
import MiniDrawer from '../components/Drawer';
import dynamic from 'next/dynamic';

const DynamicComponentWithNoSSR = dynamic(() => import('../components/Map'), {
  ssr: false,
});
export default function Home() {
  return (
    <div className="container">
      <main>
        <MiniDrawer>
          <DynamicComponentWithNoSSR />
        </MiniDrawer>
      </main>
    </div>
  );
}
