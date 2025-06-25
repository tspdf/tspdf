import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';

import styles from './index.module.css';

export default function Home() {
  return (
    <Layout
      title='TS PDF'
      description='PDF.js made simple: React base. More frameworks coming soon.'
    >
      <main>
        <div className={styles.hero}>
          <h1 className={styles.title}>TS PDF</h1>
          <p className={styles.subtitle}>
            PDF.js made simple: React base implementation. More frameworks
            coming soon.
          </p>
          <p className={styles.notice}>⚠️ Pre-release: Not production ready.</p>
          <div className={styles.buttons}>
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
      </main>
    </Layout>
  );
}
