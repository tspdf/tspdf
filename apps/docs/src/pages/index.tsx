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
        <div className='grid min-h-[calc(100vh-64px)] grid-cols-1 items-center gap-8 px-16 sm:grid-cols-2'>
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
                Modern PDF viewer library designed to make embedding PDFs into
                websites straightforward and flexible.
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

        <section className='!flex items-center justify-center px-8 pb-64 text-center'>
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

                <div className='flex flex-col items-center md:items-start'>
                  <img
                    src='https://upload.wikimedia.org/wikipedia/commons/2/29/Postgresql_elephant.svg'
                    alt='PostgreSQL Logo'
                    className='mb-4 w-10'
                  />
                  <h2 className='mb-4 text-2xl font-bold text-blue-800'>
                    Customizable PDF Viewer (in progress)
                  </h2>
                  <ul className='list-disc pl-5'>
                    <li>
                      Full control over styles, layout, and available tools.
                    </li>
                    <li>
                      Option to display PDFs without common viewer UI elements
                      like download buttons or zoom controls, so on.
                    </li>
                    <li>
                      {' '}
                      A complete, ready-to-use viewer option for those who want
                      a fully featured yet still customizable PDF solution.
                    </li>
                  </ul>
                </div>
              </div>
              <div className='rounded-lg bg-[var(--ifm-color-primary-lightest)] p-6 shadow-sm'>
                <h3 className='mb-3 text-xl font-semibold'>Performance</h3>
                <p className='text-base'>
                  Optimized for speed with minimal overhead, using native PDF
                  rendering when possible.
                </p>

                <div className='flex flex-col items-center md:items-start'>
                  <img
                    src='https://upload.wikimedia.org/wikipedia/commons/2/29/Postgresql_elephant.svg'
                    alt='PostgreSQL Logo'
                    className='mb-4 w-10'
                  />
                  <h2 className='mb-4 text-2xl font-bold text-blue-800'>
                    Performance-Focused PDF Viewer (planned)
                  </h2>
                  <ul className='list-disc pl-5'>
                    <li>Designed for minimal overhead and fast rendering.</li>
                    <li>
                      Uses the browser’s native PDF viewer when available for
                      better performance and smaller bundle sizes.
                    </li>
                    <li>
                      Includes compatibility logic to ensure consistent
                      rendering across different browsers and environments.
                    </li>
                    <li>
                      Planned fallback to PDF.js for browsers without built-in
                      PDF support.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className='!flex items-center justify-center px-8 pb-64 text-center'>
          <div className='flex max-w-6xl flex-col items-center justify-center'>
            <h1>What’s Next</h1>
            <div className='mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2'>
              <div className='p-6 shadow-sm'>
                <h3>Our next milestones are:</h3>
              </div>

              <div className='p-6 shadow-sm'>
                <p className='text-lg'>
                  Finalizing the customizable viewer’s core API and UI
                  flexibility. Building the compatibility layer for the
                  performance viewer. Testing across major browsers and
                  frameworks to ensure smooth integration.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section style={{ textAlign: 'center', marginTop: '3rem' }}>
          <p>
            Currently supported: React - additional frameworks are planned. Full
            documentation is coming soon. Visit our{' '}
            <Link to='https://github.com/tspdf/tspdf'>GitHub repo</Link> for
            more details.
          </p>
        </section>
      </main>
    </Layout>
  );
}
