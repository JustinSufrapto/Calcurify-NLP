import { PieChart, Pie, Cell } from 'recharts';
import './SpeedoMeter.css'

interface GaugeProps {
    value: number;
    centerText?: string;
    widths?: number;
    heights?: number;
    percentage: number;
}

const BigSpeedometer = ({ value, percentage, centerText, widths = 300, heights = 300 }: GaugeProps) => {
    const percent = Math.min(Math.max(value, 0), 100);
    const data = [
        { value: percent },
        { value: 100 - percent }
    ];
    const COLORS = ['#00C49F', '#FFFFFF'];

    // Calculate radii based on width/height
    const minSize = Math.min(widths, heights);
    const outerRadius = Math.floor(minSize / 2 * 0.8); // 80% of half the min size
    const innerRadius = Math.floor(outerRadius * 0.75); // 75% of outerRadius

    return (
        <div
            className="speedometer-container"
            style={{ width: widths, height: heights, position: 'relative' }}
        >
            <PieChart width={widths} height={heights}>
                <Pie
                    data={data}
                    startAngle={270}
                    endAngle={-90}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius}
                    paddingAngle={0}
                    dataKey="value"
                    stroke="none"
                >
                    {data.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
            </PieChart>
            <div
                className="speedometer-center-text"
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                    width: '100%',
                }}
            >
                <div className="text-2xl" style={{
                    fontWeight: 'bold',
                    fontSize: '3rem',
                }}

                >{percentage}</div>
                <div className="text-2xl">{centerText || `${percent}%`}</div>
            </div>
        </div>
    );
};

export default BigSpeedometer;
