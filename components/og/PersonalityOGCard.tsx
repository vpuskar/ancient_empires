type PersonalityOGCardProps = {
  empireColor: string;
  empireLabel: string;
  rulerName: string;
  rulerTitle: string;
  matchPercent: number;
  traits: string[];
};

export function PersonalityOGCard({
  empireColor,
  empireLabel,
  rulerName,
  rulerTitle,
  matchPercent,
  traits,
}: PersonalityOGCardProps) {
  return (
    <div
      style={{
        width: '1200px',
        height: '630px',
        background: '#111111',
        display: 'flex',
        flexDirection: 'row',
        color: '#F5ECD7',
        fontFamily: 'Inter',
      }}
    >
      <div
        style={{
          width: 380,
          height: 630,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          padding: 40,
          background: `${empireColor}26`,
          position: 'relative',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 24,
            left: 24,
            width: 24,
            height: 24,
            display: 'flex',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: 24,
              height: 2,
              background: 'rgba(201,168,76,0.4)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: 2,
              height: 24,
              background: 'rgba(201,168,76,0.4)',
            }}
          />
        </div>

        <div
          style={{
            position: 'absolute',
            top: 24,
            right: 24,
            width: 24,
            height: 24,
            display: 'flex',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: 24,
              height: 2,
              background: 'rgba(201,168,76,0.4)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: 2,
              height: 24,
              background: 'rgba(201,168,76,0.4)',
            }}
          />
        </div>

        <div
          style={{
            position: 'relative',
            width: 180,
            height: 180,
            borderRadius: 90,
            border: '2px solid rgba(201,168,76,0.4)',
            display: 'flex',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 10,
              left: 10,
              width: 160,
              height: 160,
              borderRadius: 80,
              border: '1px solid rgba(201,168,76,0.2)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 20,
              left: 20,
              width: 140,
              height: 140,
              borderRadius: 70,
              background: `${empireColor}40`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 64,
              fontWeight: 700,
              color: '#C9A84C',
            }}
          >
            {rulerName[0].toUpperCase()}
          </div>
        </div>

        <div
          style={{
            fontSize: 13,
            color: '#C9A84C',
            letterSpacing: '0.15em',
          }}
        >
          {matchPercent}% MATCH
        </div>

        <div
          style={{
            fontSize: 32,
            fontWeight: 700,
            color: '#C9A84C',
            letterSpacing: '0.05em',
            textAlign: 'center',
          }}
        >
          {rulerName.toUpperCase()}
        </div>

        <div
          style={{
            fontSize: 10,
            color: 'rgba(201,168,76,0.55)',
            letterSpacing: '0.12em',
            textAlign: 'center',
          }}
        >
          YOUR {empireLabel.toUpperCase()} MATCH
        </div>
      </div>

      <div
        style={{
          width: 1,
          alignSelf: 'center',
          height: '70%',
          background: 'rgba(201,168,76,0.2)',
        }}
      />

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 48,
          gap: 18,
        }}
      >
        <div
          style={{
            fontSize: 11,
            letterSpacing: '0.22em',
            color: 'rgba(201,168,76,0.55)',
          }}
        >
          ANCIENT EMPIRES
        </div>

        <div
          style={{
            fontSize: 44,
            fontWeight: 700,
            color: '#F5ECD7',
            lineHeight: 1.1,
          }}
        >
          YOU ARE {rulerName.toUpperCase()}.
        </div>

        <div
          style={{
            fontSize: 15,
            color: 'rgba(245,236,215,0.65)',
            fontStyle: 'italic',
          }}
        >
          {rulerTitle}
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 8,
            flexWrap: 'wrap',
          }}
        >
          {traits.map((trait) => (
            <div
              key={trait}
              style={{
                background: 'rgba(201,168,76,0.1)',
                border: '1px solid rgba(201,168,76,0.28)',
                borderRadius: 20,
                padding: '5px 14px',
                fontSize: 12,
                color: '#C9A84C',
              }}
            >
              {trait}
            </div>
          ))}
        </div>

        <div
          style={{
            height: 1,
            background: 'rgba(201,168,76,0.15)',
            marginTop: 4,
          }}
        />

        <div
          style={{
            fontSize: 13,
            color: 'rgba(201,168,76,0.55)',
            letterSpacing: '0.04em',
          }}
        >
          Discover your empire at ancient-empires.vercel.app
        </div>
      </div>
    </div>
  );
}
