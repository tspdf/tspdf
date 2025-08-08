import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
/*
import styles from './index.module.css';*/

export default function Home() {
  return (
    <Layout
      title='TS PDF'
      description='PDF.js made simple: React base. More frameworks coming soon.'
    >
      <main>
        <div className='grid grid-cols-1 items-center gap-8 px-16 !py-42 sm:grid-cols-2'>
          {/* Columna 1: logo y texto lado a lado */}
          <div className='flex items-center justify-center space-x-8 lg:justify-start'>
            <img
              src='/img/logoTest.png'
              alt='TS PDF logo'
              className='h-auto !max-w-[300px]'
            />
            <div className='flex flex-col items-start space-y-6 text-left'>
              <h1 className='!text-[60px] font-bold'>TS PDF</h1>
              <p className='sm:text-1xl max-w-md text-xl'>
                PDF.js made simple: React base implementation. More frameworks
                coming soon.
              </p>
              <div className='flex flex-wrap gap-2'>
                <Link
                  to='https://github.com/tspdf/tspdf'
                  className='button button--primary button--lg'
                >
                  Get Started
                </Link>
                <Link
                  to='https://github.com/tspdf/tspdf/issues'
                  className='button button--secondary button--lg'
                >
                  Contribute
                </Link>
                <Link to='/demo' className='button button--primary button--lg'>
                  Demo
                </Link>
              </div>
            </div>
          </div>

          {/* Columna 2: segunda imagen */}
          <div className='flex justify-center'>
            <img
              src='/img/imagenPrueba.png'
              alt='imagen prueba'
              className='h-auto !max-w-[600px]'
            />
          </div>
        </div>
        {/*
        <section className={styles.features}>
          <div className={styles.feature}>
            <h3>React Base</h3>
            <p>Foundation built in React for basic PDF rendering.</p>
          </div>
          <div className={styles.feature}>
            <h3>Framework Agnostic</h3>
            <p>Designed for easy extension to other frameworks.</p>
          </div>
          <div className={styles.feature}>
            <h3>Lightweight</h3>
            <p>Minimal bundle size, only what you need.</p>
          </div>
          <div className={styles.feature}>
            <h3>Open Source</h3>
            <p>Community-driven and MIT licensed.</p>
          </div>
        </section>

        <section style={{ textAlign: 'center', marginTop: '3rem' }}>
          <p>
            Full documentation is coming soon. Visit our{' '}
            <Link to='https://github.com/tspdf/tspdf'>GitHub repo</Link> for
            more details.
          </p>
        </section>
*/}
      </main>
    </Layout>
  );
}
