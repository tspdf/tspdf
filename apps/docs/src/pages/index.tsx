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
          <div className='flex flex-col items-center justify-center space-y-6 sm:flex-row sm:items-center sm:justify-start sm:space-y-0 sm:space-x-8'>
            <img
              src='/img/logoTest.png'
              alt='TS PDF logo'
              className='h-auto !max-w-[300px] max-w-full'
            />
            <div className='flex flex-col items-center space-y-6 text-center sm:items-start sm:text-left'>
              <h1 className='!text-[60px] font-bold'>TS PDF</h1>
              <p className='sm:text-1xl max-w-md text-xl'>
                PDF.js made simple: React base implementation. More frameworks
                coming soon.
              </p>
              <div className='flex flex-wrap justify-center gap-2 sm:justify-start'>
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
          <div className='flex justify-center px-4'>
            <img
              src='/img/imagenPrueba.png'
              alt='imagen prueba'
              className='h-auto !max-w-[300px] max-w-full sm:!max-w-[600px]'
            />
          </div>
        </div>

        <section className='!flex min-h-screen items-center justify-center px-8 text-center'>
          <div className='flex max-w-6xl flex-col items-center justify-center'>
            <h2 className='mb-4 text-3xl font-bold'>Our Goal</h2>
            <p className='max-w-4xl text-lg leading-relaxed'>
              Our goal is to provide reliable, easy-to-use tools for rendering
              and displaying PDFs in modern web libraries and frameworks. We
              want developers to be able to choose between{' '}
              <strong>maximum customization</strong> and{' '}
              <strong>maximum performance</strong>, whether that means rendering
              a single PDF page or integrating a fully featured PDF viewer
              directly into the browser.
            </p>

            <div className='mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2'>
              <div className='rounded-lg bg-[var(--ifm-color-primary-lightest)] p-6 shadow-sm'>
                <h3 className='mb-3 text-xl font-semibold'>Customization</h3>
                <p className='text-base'>
                  Maximum flexibility to style, layout, and control PDF viewing
                  exactly as you need.
                </p>
              </div>
              <div className='rounded-lg bg-[var(--ifm-color-primary-lightest)] p-6 shadow-sm'>
                <h3 className='mb-3 text-xl font-semibold'>Performance</h3>
                <p className='text-base'>
                  Optimized for speed with minimal overhead, using native PDF
                  rendering when possible.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className='mt-12 flex flex-wrap justify-center gap-4 px-6'>
          <div className='m-4 max-w-[250px] flex-1 basis-[200px] rounded-lg bg-[var(--ifm-color-primary-lightest)] p-4'>
            <h3 className='mb-2 text-xl'>React Base</h3>
            <p className='m-0 text-base'>
              Foundation built in React for basic PDF rendering.
            </p>
          </div>

          <div className='m-4 max-w-[250px] flex-1 basis-[200px] rounded-lg bg-[var(--ifm-color-primary-lightest)] p-4'>
            <h3 className='mb-2 text-xl'>Framework Agnostic</h3>
            <p className='m-0 text-base'>
              Designed for easy extension to other frameworks.
            </p>
          </div>

          <div className='m-4 max-w-[250px] flex-1 basis-[200px] rounded-lg bg-[var(--ifm-color-primary-lightest)] p-4'>
            <h3 className='mb-2 text-xl'>Lightweight</h3>
            <p className='m-0 text-base'>
              Minimal bundle size, only what you need.
            </p>
          </div>

          <div className='m-4 max-w-[250px] flex-1 basis-[200px] rounded-lg bg-[var(--ifm-color-primary-lightest)] p-4'>
            <h3 className='mb-2 text-xl'>Open Source</h3>
            <p className='m-0 text-base'>Community-driven and MIT licensed.</p>
          </div>
        </section>

        <section style={{ textAlign: 'center', marginTop: '3rem' }}>
          <p>
            Full documentation is coming soon. Visit our{' '}
            <Link to='https://github.com/tspdf/tspdf'>GitHub repo</Link> for
            more details.
          </p>
        </section>
      </main>
    </Layout>
  );
}
